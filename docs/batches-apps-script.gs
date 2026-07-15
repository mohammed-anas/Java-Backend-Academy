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
 *            • seats_taken  — how many are already confirmed (integer). The
 *                             site shows seats_left = max(total − taken, 0).
 *                             The script increments this automatically on
 *                             every accepted ENROL and decrements it on every
 *                             accepted OPT_OUT (concurrency-safe via
 *                             LockService). Owner may still edit manually.
 *            • enrollment_open — TRUE / FALSE. FALSE hides the batch from GET.
 *            • hidden       — TRUE / FALSE. TRUE hides the batch from GET.
 *
 *        • Tab 2 — rename to "enrollments"
 *          Paste this header row (row 1, columns A–J):
 *            submitted_at | batch_id | course_n | intent | name | email |
 *            phone | message | approved | ip
 *
 *   2. Copy the Sheet ID from its URL (long string between /d/ and /edit).
 *   3. Go to https://script.google.com/  →  New Project.
 *   4. Delete the boilerplate, paste this entire file. Update SHEET_ID below.
 *   5. Deploy →  New deployment  →  Type: Web app.
 *        • Execute as:      Me (your Google account)
 *        • Who has access:  Anyone   ← must be Anyone for the website to reach it
 *   6. Copy the resulting Web App URL.
 *   7. In your website repo, set REACT_APP_BATCHES_API=<that URL>
 *      in frontend/.env (or paste it into BATCHES_API_URL in src/site/content.js).
 *
 * SECURITY POSTURE
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
 *                   seats_taken is bumped by +1 atomically (LockService).
 *                   Row is written with approved=TRUE (self-service).
 *       — OPT_OUT:  must reference a batch the same email OR phone previously
 *                   enrolled in (and hasn't already opted out of).
 *                   Decrements seats_taken by 1 (never below 0) atomically.
 *       — INTERESTED / TAKING: append-only, no seat effect.
 *       — payload is trimmed & length-capped; intent must be in a fixed set.
 *       — 1 submission / 60s per IP throttle.
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
 * Concurrency: everything that mutates the batches sheet is wrapped in a
 * document-wide LockService lock, so two simultaneous enrollments cannot
 * over-book (or under-book on opt-out) the same batch.
 *
 * Duplicate protection: an ENROL is rejected if the SAME email or phone
 * already has an ENROL row for that batch WITHOUT a matching OPT_OUT after
 * it. An OPT_OUT only counts if there is a prior "active" ENROL by the same
 * email/phone for the same batch — otherwise it's rejected as not_enrolled.
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

    /* Rate limit: 1 submission / 60s per IP. */
    var ip = (e.parameter && e.parameter.userIp) || '';
    var cache = CacheService.getScriptCache();
    if (ip) {
      var rlKey = 'rl_batch_' + ip;
      if (cache.get(rlKey)) return _json({ ok: false, error: 'rate_limited' });
      cache.put(rlKey, '1', 60);
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

/* -------- ENROL handler (increments seats_taken) ------------------------ */
function _handleEnrol(p) {
  var lock = LockService.getDocumentLock();
  try { lock.waitLock(15000); } catch (_) {
    return _json({ ok: false, error: 'busy_try_again' });
  }
  try {
    var bsheet = _sheet(BATCHES_TAB);
    if (!bsheet) return _json({ ok: false, error: 'batches_tab_missing' });
    var blast = bsheet.getLastRow();
    if (blast < 2) return _json({ ok: false, error: 'no_batches' });

    var bh = _headers(bsheet);
    var bi = _indexMap(bh);
    // Sanity: sheet must expose the columns we need.
    if (bi['id'] == null || bi['course_n'] == null ||
        bi['seats_total'] == null || bi['seats_taken'] == null) {
      return _json({ ok: false, error: 'batches_schema_bad' });
    }

    var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
    var matchRow = -1; // sheet row index (1-based, header is row 1)
    for (var r = 0; r < brows.length; r++) {
      var rowId       = _clean(brows[r][bi['id']], 64);
      var rowCourseN  = _clean(brows[r][bi['course_n']], 4);
      if (rowId === p.batchId && rowCourseN === p.courseN) {
        matchRow = r + 2; // +2 because array is 0-based & row 1 is header
        break;
      }
    }
    if (matchRow === -1) return _json({ ok: false, error: 'unknown_batch' });

    var rowVals = bsheet.getRange(matchRow, 1, 1, bh.length).getValues()[0];
    var total   = _toInt(rowVals[bi['seats_total']], 0);
    var taken   = _toInt(rowVals[bi['seats_taken']], 0);
    var openOk  = bi['enrollment_open'] != null
      ? _toBool(rowVals[bi['enrollment_open']]) : true;
    var hidden  = bi['hidden'] != null
      ? _toBool(rowVals[bi['hidden']]) : false;

    if (!openOk || hidden) {
      return _json({ ok: false, error: 'enrollment_closed' });
    }
    if (taken >= total) {
      return _json({ ok: false, error: 'batch_full', seats_left: 0 });
    }

    /* Duplicate check — does this email/phone already hold an active seat
     * in this batch? An enrollment is "active" if the person has an ENROL
     * row for this batch not followed by an OPT_OUT row for the same batch
     * (matched by email OR phone). */
    var active = _activeEnrollmentsFor(p.batchId, p.email, p.phone);
    if (active > 0) {
      return _json({ ok: false, error: 'already_enrolled' });
    }

    /* Commit — bump seats_taken, then append the audit row. */
    var newTaken = taken + 1;
    bsheet.getRange(matchRow, bi['seats_taken'] + 1).setValue(newTaken);
    SpreadsheetApp.flush();

    _appendEnrollment({
      batchId: p.batchId, courseN: p.courseN, intent: 'ENROL',
      name: p.name, email: p.email, phone: p.phone,
      message: p.message, approved: true, ip: p.ip
    });

    return _json({
      ok: true,
      seats_left: Math.max(total - newTaken, 0),
      seats_total: total
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/* -------- OPT_OUT handler (decrements seats_taken) ---------------------- */
function _handleOptOut(p) {
  var lock = LockService.getDocumentLock();
  try { lock.waitLock(15000); } catch (_) {
    return _json({ ok: false, error: 'busy_try_again' });
  }
  try {
    var bsheet = _sheet(BATCHES_TAB);
    if (!bsheet) return _json({ ok: false, error: 'batches_tab_missing' });
    var blast = bsheet.getLastRow();
    if (blast < 2) return _json({ ok: false, error: 'no_batches' });

    var bh = _headers(bsheet);
    var bi = _indexMap(bh);
    if (bi['id'] == null || bi['course_n'] == null ||
        bi['seats_total'] == null || bi['seats_taken'] == null) {
      return _json({ ok: false, error: 'batches_schema_bad' });
    }

    var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
    var matchRow = -1;
    for (var r = 0; r < brows.length; r++) {
      var rowId       = _clean(brows[r][bi['id']], 64);
      var rowCourseN  = _clean(brows[r][bi['course_n']], 4);
      if (rowId === p.batchId && rowCourseN === p.courseN) {
        matchRow = r + 2;
        break;
      }
    }
    if (matchRow === -1) return _json({ ok: false, error: 'unknown_batch' });

    /* Must have an active prior ENROL by this email/phone in this batch. */
    var active = _activeEnrollmentsFor(p.batchId, p.email, p.phone);
    if (active <= 0) {
      return _json({ ok: false, error: 'not_enrolled' });
    }

    var rowVals = bsheet.getRange(matchRow, 1, 1, bh.length).getValues()[0];
    var total   = _toInt(rowVals[bi['seats_total']], 0);
    var taken   = _toInt(rowVals[bi['seats_taken']], 0);
    var newTaken = Math.max(taken - 1, 0);
    bsheet.getRange(matchRow, bi['seats_taken'] + 1).setValue(newTaken);
    SpreadsheetApp.flush();

    _appendEnrollment({
      batchId: p.batchId, courseN: p.courseN, intent: 'OPT_OUT',
      name: p.name, email: p.email, phone: p.phone,
      message: p.message, approved: true, ip: p.ip
    });

    return _json({
      ok: true,
      seats_left: Math.max(total - newTaken, 0),
      seats_total: total
    });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/* -------- shared helpers ------------------------------------------------- */

/*
 * Counts how many "active" enrolments the given contact has in the given
 * batch. Walks the enrollments sheet top-to-bottom, matching on email OR
 * phone. Each ENROL adds 1; each OPT_OUT for the same batch by the same
 * contact subtracts 1 (floored at 0). Returns 0 or 1 in practice.
 */
function _activeEnrollmentsFor(batchId, email, phone) {
  var esheet = _sheet(ENROLLMENTS_TAB);
  if (!esheet) return 0;
  var elast = esheet.getLastRow();
  if (elast < 2) return 0;

  var eh = _headers(esheet);
  var ei = _indexMap(eh);
  if (ei['batch_id'] == null || ei['intent'] == null) return 0;

  var evals = esheet.getRange(2, 1, elast - 1, eh.length).getValues();
  var count = 0;
  var wantEmail = (email || '').toLowerCase();
  var wantPhone = _digits(phone);
  for (var i = 0; i < evals.length; i++) {
    var row = evals[i];
    if (_clean(row[ei['batch_id']], 64) !== batchId) continue;
    var rowEmail = ei['email'] != null
      ? String(row[ei['email']] || '').toLowerCase().trim() : '';
    var rowPhone = ei['phone'] != null
      ? _digits(row[ei['phone']]) : '';
    var contactMatch =
      (wantEmail && rowEmail && wantEmail === rowEmail) ||
      (wantPhone && rowPhone && wantPhone === rowPhone);
    if (!contactMatch) continue;
    var rowIntent = String(row[ei['intent']] || '').toUpperCase().trim();
    if (rowIntent === 'ENROL') count += 1;
    else if (rowIntent === 'OPT_OUT') count = Math.max(count - 1, 0);
  }
  return count;
}

function _digits(v) {
  return String(v == null ? '' : v).replace(/[^0-9]/g, '');
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
