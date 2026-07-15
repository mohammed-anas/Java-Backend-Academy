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
 *                             KEEP THIS OWNER-EDITED. Do not wire it to POST.
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
 *   • POST is strictly append-only to the "enrollments" tab:
 *       — always writes approved=FALSE. Enrollments never affect seats_taken.
 *       — payload is trimmed & length-capped; intent must be in a fixed set.
 *       — batch_id + course_n are cross-checked against the batches sheet;
 *         unknown pairs are rejected.
 *       — 1 submission / 60s per IP throttle.
 *       — an enrollment is NEVER visible on the public site unless the owner
 *         both approves it (approved=TRUE) AND bumps seats_taken manually.
 *   • If the URL leaks or is abused, redeploy for a new URL and update the site.
 *   • Nothing here mutates the batches sheet. Ever.
 */

var SHEET_ID          = 'PASTE_YOUR_SHEET_ID_HERE';
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

/* -------- POST: append a pending enrollment intent ---------------------- */
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

    /* For ENROL / OPT_OUT — batch_id + course_n must exist in batches sheet. */
    if (intent === 'ENROL' || intent === 'OPT_OUT') {
      var bsheet = _sheet(BATCHES_TAB);
      if (!bsheet) return _json({ ok: false, error: 'batches_tab_missing' });
      var blast = bsheet.getLastRow();
      if (blast < 2) return _json({ ok: false, error: 'no_batches' });
      var bh = _headers(bsheet);
      var bi = _indexMap(bh);
      var brows = bsheet.getRange(2, 1, blast - 1, bh.length).getValues();
      var matched = brows.some(function (r) {
        return _clean(r[bi['id']], 64) === batchId &&
               _clean(r[bi['course_n']], 4) === courseN;
      });
      if (!matched) return _json({ ok: false, error: 'unknown_batch' });
    } else {
      /* For INTERESTED / TAKING, batch_id is optional; course_n must be in allow-list */
      if (courseN && ALLOWED_COURSES.indexOf(courseN) === -1) {
        return _json({ ok: false, error: 'invalid_course' });
      }
      batchId = batchId || '';
    }

    /* 1 submission / 60s per IP. */
    var ip = (e.parameter && e.parameter.userIp) || '';
    var cache = CacheService.getScriptCache();
    if (ip) {
      var key = 'rl_batch_' + ip;
      if (cache.get(key)) return _json({ ok: false, error: 'rate_limited' });
      cache.put(key, '1', 60);
    }

    var esheet = _sheet(ENROLLMENTS_TAB);
    if (!esheet) return _json({ ok: false, error: 'enrollments_tab_missing' });
    esheet.appendRow([
      new Date(),
      batchId,
      courseN,
      intent,
      name,
      email,
      phone,
      message,
      false, // approved — owner flips to TRUE when validated
      ip
    ]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}
