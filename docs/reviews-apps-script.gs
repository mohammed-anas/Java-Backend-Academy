/**
 * Java Backend Academy — Reviews backend (Google Apps Script)
 * ----------------------------------------------------------------
 * PURPOSE
 *   Serve read-only APPROVED reviews to the public website AND accept new
 *   submissions from the site's "Share your story" form. The Google Sheet ID
 *   never leaves this script — the website only ever knows the deployed
 *   Web App URL of this script.
 *
 * ONE-TIME SETUP
 *   1. Create a new Google Sheet. Rename Sheet1 to "reviews".
 *   2. Paste this exact header row (row 1, columns A–J):
 *        submitted_at | name | rating | batch | from | to | grade | comment | approved | ip
 *   3. Copy the Sheet ID from its URL (the long string between /d/ and /edit).
 *   4. Go to https://script.google.com/  →  New Project.
 *   5. Delete the boilerplate, paste this entire file. Update SHEET_ID below.
 *   6. Deploy →  New deployment  →  Type: Web app.
 *        • Execute as:      Me (your Google account)
 *        • Who has access:  Anyone   ← must be Anyone for the website to reach it
 *   7. Copy the resulting Web App URL.
 *   8. In your website repo, set REACT_APP_REVIEWS_API=<that URL> in frontend/.env
 *      (or paste the URL directly into REVIEWS_API_URL in src/site/content.js).
 *   9. Approve a review by opening the Sheet and setting `approved` to TRUE.
 *
 * SECURITY NOTES
 *   • The Sheet ID is stored ONLY inside this script — never in the website bundle.
 *   • GET returns ONLY rows where approved=TRUE. Unapproved rows are never exposed.
 *   • POST always writes with approved=FALSE. Nothing appears until you approve.
 *   • Basic per-IP throttling and payload size limits keep casual spam out.
 *   • If the URL is ever leaked/abused, redeploy for a new URL and update the site.
 */

var SHEET_ID   = 'PASTE_YOUR_SHEET_ID_HERE';
var SHEET_NAME = 'reviews';
var MAX_COMMENT_LEN = 1200;
var MAX_FIELD_LEN   = 160;
var MIN_COMMENT_LEN = 12;

function _sheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function _headers(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _clean(v, n) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n || MAX_FIELD_LEN);
}

/* -------- GET: return only approved reviews ------------------------------ */
function doGet() {
  try {
    var sheet = _sheet();
    var last = sheet.getLastRow();
    if (last < 2) return _json([]);

    var headers = _headers(sheet);
    var idx = {};
    headers.forEach(function (h, i) { idx[String(h).toLowerCase().trim()] = i; });

    var rows = sheet.getRange(2, 1, last - 1, headers.length).getValues();
    var approvedCol = idx['approved'];

    var out = rows
      .filter(function (r) {
        var v = r[approvedCol];
        return v === true || String(v).toUpperCase() === 'TRUE';
      })
      .map(function (r) {
        return {
          name:    r[idx['name']]    || '',
          rating:  Number(r[idx['rating']]) || 5,
          batch:   r[idx['batch']]   || '',
          from:    _formatDate(r[idx['from']]),
          to:      _formatDate(r[idx['to']]),
          grade:   r[idx['grade']]   || '',
          comment: r[idx['comment']] || ''
        };
      })
      .reverse(); // newest approved first

    return _json(out);
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}

function _formatDate(v) {
  if (!v) return '';
  if (v instanceof Date) {
    var yy = v.getFullYear();
    var mm = String(v.getMonth() + 1).padStart(2, '0');
    return yy + '-' + mm;
  }
  // Already a string like "2025-05" or "2025-05-01"
  return String(v).slice(0, 7);
}

/* -------- POST: append a pending review --------------------------------- */
function doPost(e) {
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (_) { body = {}; }

    var name    = _clean(body.name,    120);
    var rating  = Math.max(1, Math.min(5, Number(body.rating) || 0));
    var batch   = _clean(body.batch,   120);
    var from    = _clean(body.from,    32);
    var to      = _clean(body.to,      32);
    var grade   = _clean(body.grade,   160);
    var comment = _clean(body.comment, MAX_COMMENT_LEN);

    if (!name || !comment || comment.length < MIN_COMMENT_LEN || !rating) {
      return _json({ ok: false, error: 'invalid_payload' });
    }

    // Very light per-IP rate limit — 1 submission / 60s per address.
    var ip = (e.parameter && e.parameter.userIp) || '';
    var cache = CacheService.getScriptCache();
    if (ip) {
      var key = 'rl_' + ip;
      if (cache.get(key)) return _json({ ok: false, error: 'rate_limited' });
      cache.put(key, '1', 60);
    }

    var sheet = _sheet();
    sheet.appendRow([
      new Date(),
      name,
      rating,
      batch,
      from,
      to,
      grade,
      comment,
      false, // approved — flip to TRUE in the sheet when you're happy with it
      ip
    ]);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: 'server_error' });
  }
}
