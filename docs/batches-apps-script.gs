/**
 * Java Backend Academy — Batches backend (Google Apps Script)
 * ----------------------------------------------------------------
 * PURPOSE
 *   Serve read-only UPCOMING & OPEN batches to the public website AND accept
 *   enrollment-intent submissions from students (enrol / opt-out /
 *   taking-elsewhere / interested-but-undecided).
 *
 *   The Google Sheet ID never leaves this script — the website only ever
 *   knows the deployed Web App URL of this script. This is the same
 *   ownership model used by reviews-apps-script.gs and is the ONLY thing that
 *   keeps batch content immutable for the public.
 *
 * ONE-TIME SETUP
 *   1. Create a new Google Sheet with TWO tabs:
 *        • Tab 1 — rename to "batches"
 *          Paste this header row (row 1, columns A–O):
 *            id | course_n | course_title | start_date | end_date | time |
 *            days | mode | instructor | seats_total | seats_taken | price |
 *            notes | enrollment_open | hidden
 *
 *          Rules (owner-only, never validated on the client):
 *            • id           — free-form short string, must be unique.
 *            • course_n     — MUST match the course number on the site
 *                             (e.g. "01", "02" … "09"). Anything else is dropped.
 *            • start_date / end_date — real Google Sheets DATE cells (best) OR
 *                             ISO strings "YYYY-MM-DD".
 *            • seats_total  — total capacity (integer, e.g. 10).
 *            • seats_taken  — how many unique people currently hold a seat.
 *                             Kept in sync from the enrollments tab after
 *                             every ENROL / OPT_OUT (ScriptLock + recount).
 *                             Owner may still edit manually; the next
 *                             mutation will re-sync from enrollments.
 *            • enrollment_open — TRUE / FALSE. FALSE hides the batch from GET.
 *            • hidden       — TRUE / FALSE. TRUE hides the batch from GET.
 *
 *        • Tab 2 — rename to "enrollments"
 *          Paste this header row (row 1, columns A–J):
 *            submitted_at | batch_id | course_n | intent | name | email |
 *            phone | message | approved | ip
 *
 *   2. Copy the Sheet ID from its URL (long string between /d/ and /edit).
 *   3. Go to https://script.google.com/  →  New Project (standalone is fine).
 *   4. Delete the boilerplate, paste this entire file. Update SHEET_ID below.
 *   5. Deploy →  New deployment  →  Type: Web app.
 *        • Execute as:      Me (your Google account)
 *        • Who has access:  Anyone   ← must be Anyone for the website to reach it
 *   6. Copy the resulting Web App URL.
 *   7. In your website repo, set REACT_APP_BATCHES_API=<that URL>
 *      in frontend/.env (or paste it into BATCHES_API_URL in src/site/content.js).
 *   8. After editing this file later: Deploy → Manage deployments → pencil →
 *      New version → Deploy (same URL keeps working).
 *
 * SECURITY / CONCURRENCY POSTURE
 *   • The Sheet ID lives ONLY inside this script — never in the website bundle.
 *   • GET is strictly read-only:
 *       — returns rows where enrollment_open=TRUE AND hidden!=TRUE.
 *       — drops rows whose start_date has already passed (past batches are hidden).
 *       — drops rows whose course_n is not in the ALLOWED_COURSES allow-list.
 *       — computes seats_left server-side so the client can't inflate capacity.
 *       — flags in-course overlaps ({start_date, end_date} intersect) so the
 *         owner sees a warning; the site can render it or ignore it.
 *   • POST appends to the "enrollments" tab AND updates seats_taken:
 *       — ENROL:    validates batch exists + not full + this email/phone
 *                   hasn't already enrolled in the same batch. On success,
 *                   appends then sets seats_taken = unique active recount
 *                   (ScriptLock — works for standalone Web Apps).
 *       — OPT_OUT:  must reference a batch the same email OR phone previously
 *                   enrolled in (and hasn't already opted out of).
 *                   Appends then re-syncs seats_taken from active enrolments.
 *       — INTERESTED / TAKING: append-only, no seat effect.
 *       — Contact matching normalises phones (IN country code / leading 0)
 *         and treats overlapping email OR phone as the same person.
 *       — Rate limit: 1 submission / 60s per contact fingerprint (and IP if present).
 *   • If the URL leaks or is abused, redeploy for a new URL and update the site.
 *   • Only ENROL / OPT_OUT mutate the batches sheet, and only the seats_taken
 *     cell of the matched row. Everything else stays owner-owned.
 */

var SHEET_ID          = '17IzcAxPpq0uvj36lmqEdcfWNPUFujX2x_8WDst4vCOo';
var BATCHES_TAB       = 'batches';
var ENROLLMENTS_TAB   = 'enrollments';

/* Allow-list of course numbers. If you add a course on the website, add its
 * number here too. Everything else is dropped from GET output. */
var ALLOWED_COURSES = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];

/* Allowed enrollment intents. Anything else is rejected on POST. */
var ALLOWED_INTENTS = ['ENROL', 'OPT_OUT', 'TAKING', 'INTERESTED'];

var MAX_FIELD_LEN   = 160;
var MAX_MESSAGE_LEN = 1200;
var MIN_NAME_LEN    = 2;
var LOCK_WAIT_MS    = 15000;

/* -------- helpers ------------------------------------------------------- */

function _sheet(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function _headers(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function _indexMap(headers) {
  var idx = {};
  headers.forEach(function (h, i) { idx[String(h).toLowerCase().trim()] = i; });
  return idx;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _clean(v, n) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n || MAX_FIELD_LEN);
}

function _toBool(v) {
  return v === true || String(v).toUpperCase() === 'TRUE';
}

function _toInt(v, dflt) {
  var n = parseInt(v, 10);
  return isNaN(n) ? (dflt || 0) : n;
}

function _toDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;
  // Accept "YYYY-MM-DD" or "YYYY-MM"
  var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(v));
  if (!m) return null;
  var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3] || 1));
  return isNaN(d.getTime()) ? null : d;
}

function _isoDay(d) {
  if (!d) return '';
  var yy = d.getFullYear();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return yy + '-' + mm + '-' + dd;
}

function _startOfToday() {
  var t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/**
 * Standalone Web Apps must use ScriptLock — DocumentLock returns null when
 * the project is not bound to a spreadsheet.
 */
function _acquireScriptLock() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(LOCK_WAIT_MS);
    return lock;
  } catch (_) {
    return null;
  }
}

function _releaseLock(lock) {
  if (!lock) return;
  try { lock.releaseLock(); } catch (_) {}
}

function _normalizeEmail(email) {
  return String(email == null ? '' : email).toLowerCase().trim();
}

/**
 * Normalise phone for IN-style numbers so "+91 98765…", "098765…",
 * and "98765…" all compare equal.
 */
function _normalizePhone(phone) {
  var d = String(phone == null ? '' : phone).replace(/[^0-9]/g, '');
  if (!d) return '';
  if (d.length >= 12 && d.indexOf('91') === 0) d = d.slice(2);
  if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
  if (d.length > 10) d = d.slice(-10);
  return d;
}

function _contactThrottleKey(email, phone, ip) {
  var e = _normalizeEmail(email);
  var p = _normalizePhone(phone);
  if (e) return 'rl_e_' + e;
  if (p) return 'rl_p_' + p;
  if (ip) return 'rl_ip_' + ip;
  return '';
}

/* -------- GET: return open, upcoming batches ---------------------------- */
function doGet() {
  try {
    var sheet = _sheet(BATCHES_TAB);
    if (!sheet) return _json({ ok: false, error: 'batches_tab_missing', batches: [] });

    var last = sheet.getLastRow();
    if (last < 2) return _json({ ok: true, batches: [] });

    var headers = _headers(sheet);
    var idx = _indexMap(headers);
    var rows = sheet.getRange(2, 1, last - 1, headers.length).getValues();
    var today = _startOfToday();

    var raw = rows.map(function (r) {
      var courseN = _clean(r[idx['course_n']], 4);
      var startD  = _toDate(r[idx['start_date']]);
      var endD    = _toDate(r[idx['end_date']]) || startD;
      var total   = _toInt(r[idx['seats_total']], 0);
      var taken   = _toInt(r[idx['seats_taken']], 0);
      var left    = Math.max(total - taken, 0);
      return {
        id:              _clean(r[idx['id']], 64),
        course_n:        courseN,
        course_title:    _clean(r[idx['course_title']], MAX_FIELD_LEN),
        start_date:      _isoDay(startD),
        end_date:        _isoDay(endD),
        _start:          startD,
        _end:            endD,
        time:            _clean(r[idx['time']], MAX_FIELD_LEN),
        days:            _clean(r[idx['days']], MAX_FIELD_LEN),
        mode:            _clean(r[idx['mode']], MAX_FIELD_LEN),
        instructor:      _clean(r[idx['instructor']], MAX_FIELD_LEN),
        seats_total:     total,
        seats_left:      left,
        price:           _clean(r[idx['price']], MAX_FIELD_LEN),
        notes:           _clean(r[idx['notes']], MAX_MESSAGE_LEN),
        enrollment_open: _toBool(r[idx['enrollment_open']]),
        hidden:          _toBool(r[idx['hidden']])
      };
    })
    .filter(function (b) {
      if (!b.id) return false;
      if (!b._start) return false;
      if (b.hidden) return false;
      if (!b.enrollment_open) return false;
      if (b._start < today) return false;                   // past batch — hide
      if (ALLOWED_COURSES.indexOf(b.course_n) === -1) return false;
      return true;
    });

    /* Overlap flag per batch — two batches for the SAME course whose date
     * ranges intersect. Owner-facing signal; site can render subtly. */
    for (var i = 0; i < raw.length; i++) {
      raw[i].overlap = false;
      for (var j = 0; j < raw.length; j++) {
        if (i === j) continue;
        if (raw[i].course_n !== raw[j].course_n) continue;
        var aS = raw[i]._start.getTime(), aE = raw[i]._end.getTime();
        var bS = raw[j]._start.getTime(), bE = raw[j]._end.getTime();
        if (aS <= bE && bS <= aE) { raw[i].overlap = true; break; }
      }
    }

    var out = raw
      .sort(function (a, b) { return a._start - b._start; })
      .map(function (b) {
        delete b._start; delete b._end; delete b.hidden; delete b.enrollment_open;
        return b;
      });

    return _json({ ok: true, batches: out, generated_at: new Date().toISOString() });
  } catch (err) {
    return _json({ ok: false, error: 'server_error', batches: [] });
  }
}

/* -------- POST: enrol / opt-out / interested / taking ------------------- */
/*
 * Concurrency: ENROL / OPT_OUT use ScriptLock so two simultaneous requests
 * cannot over-book (or under-book on opt-out) the same batch.
 *
 * Source of truth for occupancy: unique active contacts derived from the
 * enrollments tab (ENROL adds / merges, OPT_OUT removes). seats_taken on the
 * batches tab is rewritten from that recount after every mutation.
 *
 * Duplicate protection: same person = overlapping email OR normalised phone
 * with an active seat in that batch.
 */
function doPost(e) {
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (_) { body = {}; }

    var intent = _clean(body.intent, 32).toUpperCase();
    if (ALLOWED_INTENTS.indexOf(intent) === -1) {
      return _json({ ok: false, error: 'invalid_intent' });
    }

    var name    = _clean(body.name,    120);
    var email   = _clean(body.email,   160);
    var phone   = _clean(body.phone,   32);
    var message = _clean(body.message, MAX_MESSAGE_LEN);
    var courseN = _clean(body.course_n, 4);
    var batchId = _clean(body.batch_id, 64);

    if (!name || name.length < MIN_NAME_LEN) {
      return _json({ ok: false, error: 'invalid_name' });
    }
    if (!email && !phone) {
      return _json({ ok: false, error: 'contact_required' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return _json({ ok: false, error: 'invalid_email' });
    }

    /* Rate limit: 1 submission / 60s per contact (and IP when present). */
    var ip = (e.parameter && e.parameter.userIp) || '';
    var cache = CacheService.getScriptCache();
    var rlKeys = [];
    var contactKey = _contactThrottleKey(email, phone, '');
    if (contactKey) rlKeys.push(contactKey);
    if (ip) rlKeys.push('rl_ip_' + ip);
    for (var k = 0; k < rlKeys.length; k++) {
      if (cache.get(rlKeys[k])) return _json({ ok: false, error: 'rate_limited' });
    }
    for (var j = 0; j < rlKeys.length; j++) {
      cache.put(rlKeys[j], '1', 60);
    }

    /* Route by intent. ENROL / OPT_OUT mutate the batches sheet under lock. */
    if (intent === 'ENROL') {
      return _handleEnrol({
        name: name, email: email, phone: phone, message: message,
        courseN: courseN, batchId: batchId, ip: ip
      });
    }
    if (intent === 'OPT_OUT') {
      return _handleOptOut({
        name: name, email: email, phone: phone, message: message,
        courseN: courseN, batchId: batchId, ip: ip
      });
    }

    /* INTERESTED / TAKING — plain append, no batch mutation. */
    if (courseN && ALLOWED_COURSES.indexOf(courseN) === -1) {
      return _json({ ok: false, error: 'invalid_course' });
    }
    _appendEnrollment({
      batchId: '', courseN: courseN, intent: intent,
      name: name, email: email, phone: phone,
      message: message, approved: false, ip: ip
    });
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}

/* -------- ENROL handler ------------------------------------------------- */
function _handleEnrol(p) {
  if (!p.batchId || !p.courseN) {
    return _json({ ok: false, error: 'unknown_batch' });
  }
  if (ALLOWED_COURSES.indexOf(p.courseN) === -1) {
    return _json({ ok: false, error: 'invalid_course' });
  }

  var lock = _acquireScriptLock();
  if (!lock) return _json({ ok: false, error: 'busy_try_again' });

  try {
    var found = _findBatchRow(p.batchId, p.courseN);
    if (!found) return _json({ ok: false, error: 'unknown_batch' });
    if (found.error) return _json({ ok: false, error: found.error });

    var total  = found.total;
    var openOk = found.openOk;
    var hidden = found.hidden;

    if (!openOk || hidden) {
      return _json({ ok: false, error: 'enrollment_closed' });
    }

    var state = _getBatchSeatState(p.batchId);
    if (state.hasContact(p.email, p.phone)) {
      return _json({ ok: false, error: 'already_enrolled' });
    }
    if (total <= 0 || state.count >= total) {
      return _json({
        ok: false,
        error: 'batch_full',
        seats_left: 0,
        seats_total: total
      });
    }

    /* Append first, then recount + write seats_taken so the counter cannot
     * drift from the audit log if a later write fails. */
    _appendEnrollment({
      batchId: p.batchId, courseN: p.courseN, intent: 'ENROL',
      name: p.name, email: p.email, phone: p.phone,
      message: p.message, approved: true, ip: p.ip
    });

    var newTaken = _getBatchSeatState(p.batchId).count;
    found.sheet.getRange(found.matchRow, found.bi['seats_taken'] + 1).setValue(newTaken);
    SpreadsheetApp.flush();

    return _json({
      ok: true,
      seats_left: Math.max(total - newTaken, 0),
      seats_total: total
    });
  } finally {
    _releaseLock(lock);
  }
}

/* -------- OPT_OUT handler ----------------------------------------------- */
function _handleOptOut(p) {
  if (!p.batchId || !p.courseN) {
    return _json({ ok: false, error: 'unknown_batch' });
  }

  var lock = _acquireScriptLock();
  if (!lock) return _json({ ok: false, error: 'busy_try_again' });

  try {
    var found = _findBatchRow(p.batchId, p.courseN);
    if (!found) return _json({ ok: false, error: 'unknown_batch' });
    if (found.error) return _json({ ok: false, error: found.error });

    var state = _getBatchSeatState(p.batchId);
    if (!state.hasContact(p.email, p.phone)) {
      return _json({ ok: false, error: 'not_enrolled' });
    }

    _appendEnrollment({
      batchId: p.batchId, courseN: p.courseN, intent: 'OPT_OUT',
      name: p.name, email: p.email, phone: p.phone,
      message: p.message, approved: true, ip: p.ip
    });

    var total = found.total;
    var newTaken = _getBatchSeatState(p.batchId).count;
    found.sheet.getRange(found.matchRow, found.bi['seats_taken'] + 1).setValue(newTaken);
    SpreadsheetApp.flush();

    return _json({
      ok: true,
      seats_left: Math.max(total - newTaken, 0),
      seats_total: total
    });
  } finally {
    _releaseLock(lock);
  }
}

/* -------- shared helpers ------------------------------------------------- */

function _findBatchRow(batchId, courseN) {
  var bsheet = _sheet(BATCHES_TAB);
  if (!bsheet) return { error: 'batches_tab_missing' };
  var blast = bsheet.getLastRow();
  if (blast < 2) return null;

  var bh = _headers(bsheet);
  var bi = _indexMap(bh);
  if (bi['id'] == null || bi['course_n'] == null ||
      bi['seats_total'] == null || bi['seats_taken'] == null) {
    return { error: 'batches_schema_bad' };
  }

  var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
  for (var r = 0; r < brows.length; r++) {
    var rowId      = _clean(brows[r][bi['id']], 64);
    var rowCourseN = _clean(brows[r][bi['course_n']], 4);
    if (rowId === batchId && rowCourseN === courseN) {
      var rowVals = brows[r];
      return {
        sheet: bsheet,
        bi: bi,
        matchRow: r + 2,
        total: _toInt(rowVals[bi['seats_total']], 0),
        taken: _toInt(rowVals[bi['seats_taken']], 0),
        openOk: bi['enrollment_open'] != null
          ? _toBool(rowVals[bi['enrollment_open']]) : true,
        hidden: bi['hidden'] != null
          ? _toBool(rowVals[bi['hidden']]) : false
      };
    }
  }
  return null;
}

/**
 * Rebuild unique active seats for a batch from the enrollments audit log.
 * Identities merge when email OR normalised phone overlaps, so
 * email-only then phone-only (same number) cannot take two seats.
 */
function _getBatchSeatState(batchId) {
  var actives = []; // [{ emails: {e:1}, phones: {p:1} }, ...]

  function findIndex(email, phone) {
    var wantEmail = _normalizeEmail(email);
    var wantPhone = _normalizePhone(phone);
    for (var i = 0; i < actives.length; i++) {
      var a = actives[i];
      if (wantEmail && a.emails[wantEmail]) return i;
      if (wantPhone && a.phones[wantPhone]) return i;
    }
    return -1;
  }

  function mergeAt(idx, email, phone) {
    var e = _normalizeEmail(email);
    var p = _normalizePhone(phone);
    if (e) actives[idx].emails[e] = 1;
    if (p) actives[idx].phones[p] = 1;
  }

  var esheet = _sheet(ENROLLMENTS_TAB);
  if (esheet) {
    var elast = esheet.getLastRow();
    if (elast >= 2) {
      var eh = _headers(esheet);
      var ei = _indexMap(eh);
      if (ei['batch_id'] != null && ei['intent'] != null) {
        var evals = esheet.getRange(2, 1, elast - 1, eh.length).getValues();
        for (var i = 0; i < evals.length; i++) {
          var row = evals[i];
          if (_clean(row[ei['batch_id']], 64) !== batchId) continue;
          var rowIntent = String(row[ei['intent']] || '').toUpperCase().trim();
          if (rowIntent !== 'ENROL' && rowIntent !== 'OPT_OUT') continue;

          var rowEmail = ei['email'] != null ? row[ei['email']] : '';
          var rowPhone = ei['phone'] != null ? row[ei['phone']] : '';
          var idx = findIndex(rowEmail, rowPhone);

          if (rowIntent === 'ENROL') {
            if (idx >= 0) {
              mergeAt(idx, rowEmail, rowPhone);
            } else {
              var emails = {};
              var phones = {};
              var ne = _normalizeEmail(rowEmail);
              var np = _normalizePhone(rowPhone);
              if (ne) emails[ne] = 1;
              if (np) phones[np] = 1;
              if (ne || np) actives.push({ emails: emails, phones: phones });
            }
          } else if (rowIntent === 'OPT_OUT' && idx >= 0) {
            actives.splice(idx, 1);
          }
        }
      }
    }
  }

  return {
    count: actives.length,
    hasContact: function (email, phone) {
      return findIndex(email, phone) >= 0;
    }
  };
}

function _appendEnrollment(p) {
  var esheet = _sheet(ENROLLMENTS_TAB);
  if (!esheet) return;
  esheet.appendRow([
    new Date(),
    p.batchId || '',
    p.courseN || '',
    p.intent,
    p.name,
    p.email,
    p.phone,
    p.message,
    !!p.approved,
    p.ip || ''
  ]);
}

/**
 * Owner helper (run manually from the Apps Script editor):
 * Recompute seats_taken for every batch from the enrollments tab.
 * Use this once after deploying if the counter has drifted.
 */
function reconcileAllSeatCounts() {
  var bsheet = _sheet(BATCHES_TAB);
  if (!bsheet) throw new Error('batches tab missing');
  var blast = bsheet.getLastRow();
  if (blast < 2) return { updated: 0 };

  var bh = _headers(bsheet);
  var bi = _indexMap(bh);
  if (bi['id'] == null || bi['seats_taken'] == null) {
    throw new Error('batches schema bad');
  }

  var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
  var updated = 0;
  for (var r = 0; r < brows.length; r++) {
    var batchId = _clean(brows[r][bi['id']], 64);
    if (!batchId) continue;
    var count = _getBatchSeatState(batchId).count;
    bsheet.getRange(r + 2, bi['seats_taken'] + 1).setValue(count);
    updated++;
  }
  SpreadsheetApp.flush();
  return { updated: updated };
}
