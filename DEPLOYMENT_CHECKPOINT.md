# Deployment Checkpoint — Emergency Alert Phase 2 (Persistent Resolved Notification)

**Date:** 2026-07-10
**Branch:** feature/supabase
**Status:** Production-ready — awaiting push

---

## Asset Versions (Production-Ready)

| Asset | Version | Change |
|---|---|---|
| `assets/js/emergency-alert.js` | **v=9** | Added sessionStorage persistence for resolved toast |
| `assets/css/style.css` | **v=20** | Redesigned "All Clear" toast with green header bar |

All 11 public HTML files reference `?v=9` / `?v=20`.

## What Changed in This Release

- **Persistent resolved notification** using `sessionStorage` key `EA_Resolved`
- 10-minute TTL: toast reappears on page refresh and navigation within the session
- User-dismiss (×) clears storage → no reappearance
- Auto-dismiss (15s) keeps storage → reappears on next page load
- New active alert immediately clears storage and removes the toast
- Redesigned toast: green gradient header "🟢 All Clear", priority-specific title/message, fade-in animation, 15s progress bar

## Rollback

If the deployment needs to be rolled back:
- In the **Render dashboard**, go to the service → **Deploys** → select the previous deploy → **Rollback**
- No database changes were made — rollback is safe and instant

## Files Modified

- `BBCB Site/assets/js/emergency-alert.js`
- `BBCB Site/assets/css/style.css`
- All 11 public HTML files (version bump only: `?v=8→v=9`, `?v=19→v=20`)

---

## Post-Deployment Smoke Tests

Run these in order after Render finishes deploying.

### Setup
Open the live site in an **Incognito** window. Open DevTools → Network tab.

### Cache Verification (do first)
- [ ] Filter Network by `emergency-alert.js` — confirm `?v=9` loads, status 200
- [ ] Filter by `style.css` — confirm `?v=20` loads, status 200
- [ ] Console shows `[EA] API response:` log within 3 seconds of page load

---

### Test 1 — Resolve fires the toast
1. Create and activate an alert in the admin panel
2. Confirm banner appears on the public site
3. Resolve the alert from admin
4. Wait up to 60 seconds (next poll) or force-close/reopen a test alert
5. **Expected:** "🟢 All Clear" toast appears bottom-right with correct priority wording
6. **Expected:** Banner disappears simultaneously

- [ ] Toast appears
- [ ] Toast title matches priority (Emergency Resolved / Warning Lifted / Advisory Lifted)
- [ ] Banner is gone
- [ ] Console shows `[EA] No active alert.`

---

### Test 2 — Toast survives page refresh
1. After Test 1, while toast is visible (or after auto-dismiss)
2. Press F5 (normal refresh)
3. **Expected:** "🟢 All Clear" toast reappears within 1 second of page load

- [ ] Toast reappears after refresh
- [ ] Console does NOT show a second `showResolvedToast` call (no duplicate)

---

### Test 3 — Toast survives page navigation
1. After resolving an alert, navigate to another page (About, Officials, Announcements, etc.)
2. **Expected:** "🟢 All Clear" toast appears on the new page

- [ ] Toast appears on at least 2 different pages
- [ ] Toast does not appear in a brand-new Incognito tab (expected — sessionStorage is tab-specific)

---

### Test 4 — New active alert overrides "All Clear"
1. While the "All Clear" toast is visible (or within 10-min TTL on any page)
2. Create and activate a new alert in admin
3. Wait for next poll (up to 60s)
4. **Expected:** "All Clear" toast disappears immediately when the alert banner appears
5. **Expected:** No "All Clear" toast in sessionStorage (check DevTools → Application → Session Storage)

- [ ] Toast disappears when new alert is detected
- [ ] `EA_Resolved` key is absent from sessionStorage
- [ ] Alert banner appears with correct priority color and wording
- [ ] Console shows `[EA] Active alert received.`

---

### Test 5 — Manual dismiss clears storage
1. While "All Clear" toast is showing, click the × button
2. Refresh the page
3. **Expected:** Toast does NOT reappear

- [ ] Toast dismissed cleanly
- [ ] After refresh, no toast appears
- [ ] `EA_Resolved` key absent from sessionStorage after dismiss

---

### Console Health Check (after all tests)
- [ ] No red errors in DevTools Console
- [ ] `[EA] API response:` log fires every 60 seconds
- [ ] No `sessionStorage` security errors (will be visible in console if present)
