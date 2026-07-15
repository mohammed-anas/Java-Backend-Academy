/**
 * Java Backend Academy — Batches backend (Google Apps Script)
 * ----------------------------------------------------------------
 * PURPOSE
 *   Serve open upcoming batches + accept enrol / opt-out / interested /
 *   taking submissions. Sheet ID stays ONLY in this script.
 *
 * CRITICAL: Redeploy correctly
 *   Editing this file in Cursor does NOTHING for the live site.
 *   After pasting into script.google.com you MUST update the EXISTING
 *   deployment (not create a brand-new one, or the site keeps the old URL):
 *
 *     Deploy → Manage deployments → pencil (Edit) on the current Web App
 *       → Version: New version → Deploy
 *
 *   Then open the Web App URL in a browser. You MUST see:
 *     "api_version": "2026-07-16-v5"
 *   If that field is missing, the site is still hitting the OLD script.
 *   Copy the URL from Manage deployments and put it in:
 *     frontend/.env  →  REACT_APP_BATCHES_API=<url>
 *     OR frontend/src/site/content.js → BATCHES_API_URL
 *
 * WORKFLOW
 *   ENROL  → append enrollments row with approved=TRUE, claim a seat now
 *            (self-service). Contact = email OR normalised phone (either
 *            is enough). Same contact cannot:
 *              • re-enrol in the same batch until they OPT_OUT
 *              • enrol in any other batch of the SAME course while still
 *                enrolled in that course
 *              • enrol in another course whose start/end dates overlap an
 *                active enrolment
 *   OPT_OUT → frees the seat for that contact.
 *   seats_left is always derived from the enrollments tab (not only the
 *   seats_taken cell), so a browser refresh shows the truth even if the
 *   counter cell was edited by hand.
 *
 * ONE-TIME SETUP
 *   1. Sheet tabs "batches" + "enrollments" (see headers below).
 *   2. Paste this file into a standalone Apps Script project. Set SHEET_ID.
 *   3. Deploy as Web app — Execute as: Me — Who has access: Anyone.
 *   4. Wire the Web App URL into the website (env or content.js).
 *   5. Run reconcileAllSeatCounts() once from the editor after first deploy.
 *
 * batches header:
 *   id | course_n | course_title | start_date | end_date | time |
 *   days | mode | instructor | seats_total | seats_taken | price |
 *   notes | enrollment_open | hidden
 *
 * enrollments header:
 *   submitted_at | batch_id | course_n | intent | name | email |
 *   phone | message | approved | ip
 */

var SHEET_ID          = '17IzcAxPpq0uvj36lmqEdcfWNPUFujX2x_8WDst4vCOo';
var BATCHES_TAB       = 'batches';
var ENROLLMENTS_TAB   = 'enrollments';
var API_VERSION       = '2026-07-16-v5';

var ALLOWED_COURSES = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
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
  if (!obj) obj = {};
  obj.api_version = API_VERSION;
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _clean(v, n) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n || MAX_FIELD_LEN);
}

function _normCourseN(v) {
  var s = _clean(v, 4);
  /* Sheets often stores course_n as the number 1 instead of "01". */
  if (/^\d{1,2}$/.test(s)) {
    s = ('0' + s).slice(-2);
  }
  return s;
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
 * Normalise phone so "+91 98765…", "098765…", "98765…" compare equal.
 * Also handles numeric cells from Sheets.
 */
function _normalizePhone(phone) {
  var d = String(phone == null ? '' : phone).replace(/[^0-9]/g, '');
  if (!d) return '';
  if (d.length >= 12 && d.indexOf('91') === 0) d = d.slice(2);
  if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
  if (d.length > 10) d = d.slice(-10);
  return d;
}

function _contactThrottleKey(email, phone) {
  var e = _normalizeEmail(email);
  var p = _normalizePhone(phone);
  if (e) return 'rl_e_' + e;
  if (p) return 'rl_p_' + p;
  return '';
}

/* -------- GET ------------------------------------------------------------ */
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

    /* Soft-sync seats_taken from enrollments so the Sheet column stays honest
     * after manual edits / legacy rows. Non-blocking if lock is busy. */
    var syncLock = LockService.getScriptLock();
    var canSync = false;
    try { canSync = syncLock.tryLock(2000); } catch (_) { canSync = false; }

    var raw = [];
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var courseN = _normCourseN(row[idx['course_n']]);
      var startD  = _toDate(row[idx['start_date']]);
      var endD    = _toDate(row[idx['end_date']]) || startD;
      var total   = _toInt(row[idx['seats_total']], 0);
      var batchId = _clean(row[idx['id']], 64);

      /* Live occupancy from enrollments — not the (possibly stale) cell. */
      var liveTaken = batchId ? _getBatchSeatState(batchId).count : 0;
      if (canSync && batchId && idx['seats_taken'] != null &&
          _toInt(row[idx['seats_taken']], 0) !== liveTaken) {
        sheet.getRange(r + 2, idx['seats_taken'] + 1).setValue(liveTaken);
      }

      var left = Math.max(total - liveTaken, 0);
      raw.push({
        id:              batchId,
        course_n:        courseN,
        course_title:    _clean(row[idx['course_title']], MAX_FIELD_LEN),
        start_date:      _isoDay(startD),
        end_date:        _isoDay(endD),
        _start:          startD,
        _end:            endD,
        time:            _clean(row[idx['time']], MAX_FIELD_LEN),
        days:            _clean(row[idx['days']], MAX_FIELD_LEN),
        mode:            _clean(row[idx['mode']], MAX_FIELD_LEN),
        instructor:      _clean(row[idx['instructor']], MAX_FIELD_LEN),
        seats_total:     total,
        seats_left:      left,
        price:           _clean(row[idx['price']], MAX_FIELD_LEN),
        notes:           _clean(row[idx['notes']], MAX_MESSAGE_LEN),
        enrollment_open: _toBool(row[idx['enrollment_open']]),
        hidden:          _toBool(row[idx['hidden']])
      });
    }

    if (canSync) {
      try { SpreadsheetApp.flush(); } catch (_) {}
      _releaseLock(syncLock);
    }

    raw = raw.filter(function (b) {
      if (!b.id) return false;
      if (!b._start) return false;
      if (b.hidden) return false;
      if (!b.enrollment_open) return false;
      if (b._start < today) return false;
      if (ALLOWED_COURSES.indexOf(b.course_n) === -1) return false;
      return true;
    });

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
    return _json({ ok: false, error: 'server_error', batches: [], detail: String(err) });
  }
}

/* -------- POST ----------------------------------------------------------- */
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
    var courseN = _normCourseN(body.course_n);
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

    var ip = (e.parameter && e.parameter.userIp) || '';
    var cache = CacheService.getScriptCache();
    var rlKeys = [];
    var contactKey = _contactThrottleKey(email, phone);
    if (contactKey) rlKeys.push(contactKey);
    if (ip) rlKeys.push('rl_ip_' + ip);
    for (var k = 0; k < rlKeys.length; k++) {
      if (cache.get(rlKeys[k])) return _json({ ok: false, error: 'rate_limited' });
    }

    var result;
    if (intent === 'ENROL') {
      result = _handleEnrol({
        name: name, email: email, phone: phone, message: message,
        courseN: courseN, batchId: batchId, ip: ip
      });
    } else if (intent === 'OPT_OUT') {
      result = _handleOptOut({
        name: name, email: email, phone: phone, message: message,
        courseN: courseN, batchId: batchId, ip: ip
      });
    } else {
      if (courseN && ALLOWED_COURSES.indexOf(courseN) === -1) {
        return _json({ ok: false, error: 'invalid_course' });
      }
      _appendEnrollment({
        batchId: '', courseN: courseN, intent: intent,
        name: name, email: email, phone: phone,
        message: message, approved: false, ip: ip
      });
      result = _json({ ok: true });
    }

    /* Only throttle successful (or definitive) submissions so flakes can retry. */
    try {
      var parsed = JSON.parse(result.getContent());
      if (parsed && (parsed.ok || parsed.error === 'already_enrolled' ||
          parsed.error === 'already_in_course' ||
          parsed.error === 'batch_full' || parsed.error === 'not_enrolled' ||
          parsed.error === 'schedule_overlap')) {
        for (var j = 0; j < rlKeys.length; j++) cache.put(rlKeys[j], '1', 60);
      }
    } catch (_) {}

    return result;
  } catch (err) {
    return _json({ ok: false, error: 'server_error', detail: String(err) });
  }
}

/* -------- ENROL ---------------------------------------------------------- */
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

    if (!found.openOk || found.hidden) {
      return _json({ ok: false, error: 'enrollment_closed' });
    }

    var state = _getBatchSeatState(p.batchId);
    if (state.hasContact(p.email, p.phone)) {
      return _json({
        ok: false,
        error: 'already_enrolled',
        seats_left: Math.max(found.total - state.count, 0),
        seats_total: found.total
      });
    }

    /* Same contact cannot hold two seats in the same course (any batch). */
    var sameCourse = _findActiveSameCourse(p.email, p.phone, p.courseN, p.batchId);
    if (sameCourse) {
      return _json({
        ok: false,
        error: 'already_in_course',
        conflict_batch_id: sameCourse.id,
        conflict_course_n: sameCourse.course_n,
        conflict_course_title: sameCourse.course_title,
        seats_left: Math.max(found.total - state.count, 0),
        seats_total: found.total
      });
    }

    /* Same email OR phone cannot hold seats in two batches whose date
     * ranges overlap (across any course). Non-overlapping schedules are OK. */
    var overlap = _findScheduleOverlap(p.email, p.phone, p.batchId, found.startD, found.endD);
    if (overlap) {
      return _json({
        ok: false,
        error: 'schedule_overlap',
        conflict_batch_id: overlap.id,
        conflict_course_n: overlap.course_n,
        conflict_course_title: overlap.course_title,
        conflict_start: _isoDay(overlap.startD),
        conflict_end: _isoDay(overlap.endD),
        seats_left: Math.max(found.total - state.count, 0),
        seats_total: found.total
      });
    }

    if (found.total <= 0 || state.count >= found.total) {
      return _json({
        ok: false,
        error: 'batch_full',
        seats_left: 0,
        seats_total: found.total
      });
    }

    /* Self-service: approved=TRUE claims the seat immediately.
     * If you still see FALSE in the sheet after submit, the OLD Web App URL
     * is still live — check api_version on GET. */
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
      seats_left: Math.max(found.total - newTaken, 0),
      seats_total: found.total
    });
  } finally {
    _releaseLock(lock);
  }
}

/* -------- OPT_OUT -------------------------------------------------------- */
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

    var newTaken = _getBatchSeatState(p.batchId).count;
    found.sheet.getRange(found.matchRow, found.bi['seats_taken'] + 1).setValue(newTaken);
    SpreadsheetApp.flush();

    return _json({
      ok: true,
      seats_left: Math.max(found.total - newTaken, 0),
      seats_total: found.total
    });
  } finally {
    _releaseLock(lock);
  }
}

/* -------- shared --------------------------------------------------------- */

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

  var wantCourse = _normCourseN(courseN);
  var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
  for (var r = 0; r < brows.length; r++) {
    var rowId      = _clean(brows[r][bi['id']], 64);
    var rowCourseN = _normCourseN(brows[r][bi['course_n']]);
    if (rowId === batchId && rowCourseN === wantCourse) {
      var rowVals = brows[r];
      var startD = bi['start_date'] != null ? _toDate(rowVals[bi['start_date']]) : null;
      var endD   = bi['end_date'] != null ? _toDate(rowVals[bi['end_date']]) : null;
      return {
        sheet: bsheet,
        bi: bi,
        matchRow: r + 2,
        id: rowId,
        course_n: rowCourseN,
        course_title: bi['course_title'] != null
          ? _clean(rowVals[bi['course_title']], MAX_FIELD_LEN) : '',
        startD: startD,
        endD: endD || startD,
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

function _datesOverlap(aStart, aEnd, bStart, bEnd) {
  if (!aStart || !bStart) return false;
  var aE = aEnd || aStart;
  var bE = bEnd || bStart;
  return aStart.getTime() <= bE.getTime() && bStart.getTime() <= aE.getTime();
}

/**
 * Batch ids where this email OR phone currently holds an active ENROL
 * (no later OPT_OUT for that same batch by the same contact).
 */
function _activeBatchIdsForContact(email, phone) {
  var wantEmail = _normalizeEmail(email);
  var wantPhone = _normalizePhone(phone);
  if (!wantEmail && !wantPhone) return [];

  var active = {}; // batchId -> true
  var esheet = _sheet(ENROLLMENTS_TAB);
  if (!esheet) return [];
  var elast = esheet.getLastRow();
  if (elast < 2) return [];

  var eh = _headers(esheet);
  var ei = _indexMap(eh);
  if (ei['batch_id'] == null || ei['intent'] == null) return [];

  var evals = esheet.getRange(2, 1, elast - 1, eh.length).getValues();
  for (var i = 0; i < evals.length; i++) {
    var row = evals[i];
    var batchId = _clean(row[ei['batch_id']], 64);
    if (!batchId) continue;
    var rowIntent = String(row[ei['intent']] || '').toUpperCase().trim();
    if (rowIntent !== 'ENROL' && rowIntent !== 'OPT_OUT') continue;

    var rowEmail = ei['email'] != null ? row[ei['email']] : '';
    var rowPhone = ei['phone'] != null ? row[ei['phone']] : '';
    var re = _normalizeEmail(rowEmail);
    var rp = _normalizePhone(rowPhone);
    var match =
      (wantEmail && re && wantEmail === re) ||
      (wantPhone && rp && wantPhone === rp);
    if (!match) continue;

    if (rowIntent === 'ENROL') active[batchId] = true;
    else if (rowIntent === 'OPT_OUT') delete active[batchId];
  }

  var ids = [];
  for (var id in active) {
    if (active.hasOwnProperty(id) && active[id]) ids.push(id);
  }
  return ids;
}

/**
 * If the contact already has an active seat in another batch of the same
 * course_n, return that batch's meta; else null.
 */
function _findActiveSameCourse(email, phone, courseN, excludeBatchId) {
  var wantCourse = _normCourseN(courseN);
  if (!wantCourse) return null;

  var activeIds = _activeBatchIdsForContact(email, phone);
  if (!activeIds.length) return null;

  var metaById = _batchMetaById();
  for (var i = 0; i < activeIds.length; i++) {
    var otherId = activeIds[i];
    if (otherId === excludeBatchId) continue;
    var other = metaById[otherId];
    if (!other) continue;
    if (other.course_n === wantCourse) return other;
  }
  return null;
}

/**
 * If the contact already has an active seat in another batch whose dates
 * overlap the target batch, return that batch's meta; else null.
 */
function _findScheduleOverlap(email, phone, targetBatchId, targetStart, targetEnd) {
  var activeIds = _activeBatchIdsForContact(email, phone);
  if (!activeIds.length) return null;

  var byId = _batchMetaById();
  for (var i = 0; i < activeIds.length; i++) {
    var otherId = activeIds[i];
    if (otherId === targetBatchId) continue;
    var other = byId[otherId];
    if (!other) continue;
    if (_datesOverlap(targetStart, targetEnd, other.startD, other.endD)) {
      return other;
    }
  }
  return null;
}

/** Map of batch id → { id, course_n, course_title, startD, endD }. */
function _batchMetaById() {
  var out = {};
  var bsheet = _sheet(BATCHES_TAB);
  if (!bsheet) return out;
  var blast = bsheet.getLastRow();
  if (blast < 2) return out;

  var bh = _headers(bsheet);
  var bi = _indexMap(bh);
  if (bi['id'] == null) return out;

  var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
  for (var r = 0; r < brows.length; r++) {
    var id = _clean(brows[r][bi['id']], 64);
    if (!id) continue;
    var startD = bi['start_date'] != null ? _toDate(brows[r][bi['start_date']]) : null;
    var endD   = bi['end_date'] != null ? _toDate(brows[r][bi['end_date']]) : null;
    out[id] = {
      id: id,
      course_n: _normCourseN(brows[r][bi['course_n']]),
      course_title: bi['course_title'] != null
        ? _clean(brows[r][bi['course_title']], MAX_FIELD_LEN) : '',
      startD: startD,
      endD: endD || startD
    };
  }
  return out;
}

/**
 * Unique active seats for a batch from the enrollments audit log.
 * ENROL adds/merges an identity; OPT_OUT removes it.
 * Same person = email match OR normalised phone match.
 *
 * Legacy rows with approved=FALSE still count as active seats (they were
 * written by the old append-only script). New ENROLs are approved=TRUE.
 */
function _getBatchSeatState(batchId) {
  var actives = [];

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
  if (!esheet) throw new Error('enrollments_tab_missing');
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
 * Run once from the Apps Script editor after deploying:
 *   Select reconcileAllSeatCounts → Run
 * Rewrites seats_taken for every batch from unique active ENROLs.
 */
function reconcileAllSeatCounts() {
  var lock = _acquireScriptLock();
  if (!lock) throw new Error('busy_try_again');
  try {
    var bsheet = _sheet(BATCHES_TAB);
    if (!bsheet) throw new Error('batches tab missing');
    var blast = bsheet.getLastRow();
    if (blast < 2) return { updated: 0, api_version: API_VERSION };

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
    return { updated: updated, api_version: API_VERSION };
  } finally {
    _releaseLock(lock);
  }
}
