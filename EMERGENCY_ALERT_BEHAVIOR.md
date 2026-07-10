# Emergency Alert System — Expected Behavior Documentation

**System:** BBCB Public Emergency Alert (Phase 2)
**Last updated:** 2026-07-10
**JS version:** v=9 | **CSS version:** v=20

---

## How the Resolved Notification Works

When an admin resolves an active emergency alert, the public website displays a
"🟢 All Clear" notification toast. This toast is designed to persist briefly so
residents who are browsing the site at the time of resolution — or who return
shortly after — are informed that the situation is over.

### Storage Mechanism

The resolved notification uses the browser's **`sessionStorage`** API.

- **Key:** `EA_Resolved`
- **Value:** `{ "priority": "Critical|Warning|Advisory", "status": "resolved", "timestamp": <ms> }`
- **Time-to-live:** 10 minutes from the moment of resolution

The entry is written the instant the public site detects the alert has been
resolved (i.e., the first poll after the admin clicks Resolve). It is checked
on every page load within the same browser tab.

---

## Behavior by Scenario

### ✅ Same page — no refresh
Admin resolves → next poll (≤60s) detects it → toast appears, banner disappears.

### ✅ Page refresh (F5 or Ctrl+R)
Toast reappears immediately on the refreshed page, as long as the 10-minute
window has not expired and the user has not manually dismissed it.

### ✅ Navigation between website pages
Toast appears on each new page the user navigates to, within the 10-minute
window. Works across all 11 public pages (index, about, officials, services,
citizens-charter, announcements, community initiatives, contact, downloads,
transparency, emergency-alert-detail).

### ✅ Manual dismiss (× button)
Clicking × removes the toast AND clears `EA_Resolved` from sessionStorage.
The toast will not reappear on future page loads in that tab.

### ✅ Auto-dismiss (15 seconds)
The toast fades out after 15 seconds but `EA_Resolved` is kept in
sessionStorage. The toast will reappear on the next page load/navigation
within the 10-minute TTL.

### ✅ New active alert activated
When a new emergency alert becomes active, the system immediately:
1. Removes the "All Clear" toast from the page
2. Clears `EA_Resolved` from sessionStorage
3. Displays the new alert banner (and popup if Critical)

The "All Clear" notification and an active alert banner can never appear
simultaneously.

---

## Known Limitations (by Design)

### 🔵 New browser tab — toast does not appear

**Reason:** `sessionStorage` is scoped to a single browser tab. Each new tab
starts with an empty sessionStorage, so the stored resolved notification is
not visible there.

**This is expected behavior.** A resident who opens a brand-new tab after an
alert is resolved will not see the "All Clear" toast unless the alert is still
shown as active on that tab's first poll (and then resolved within the TTL).

**If cross-tab persistence is ever required:** The storage key would need to be
moved to `localStorage` (persistent across tabs, cleared manually or on a
time-check). This is a future enhancement, not a current bug.

### 🔵 Browser close and reopen — toast does not appear

**Reason:** `sessionStorage` is a session-level store. It is automatically
cleared by the browser when the session ends (tab or window closed, browser
shut down). A resident who closes and reopens the browser will not see the
"All Clear" notification.

**This is expected behavior.** The 10-minute TTL is designed for residents
actively browsing the site at the time of resolution — not for notifying
people who return after the session has ended. If a resident comes back hours
later, the situation is long resolved and the notification would be outdated.

### 🔵 Incognito/Private window — no shared storage

Each Incognito window has its own isolated sessionStorage. A resolved
notification in a regular window will not appear in an Incognito window, and
vice versa.

---

## Summary Table

| Scenario | Toast appears? | Storage cleared? |
|---|---|---|
| Admin resolves → same-tab user sees it | ✅ Yes | No (stored) |
| Page refresh within 10 min | ✅ Yes | No (re-read) |
| Navigate to another page within 10 min | ✅ Yes | No (re-read) |
| TTL expires (>10 min since resolution) | ❌ No | Yes (auto-cleared) |
| User clicks × dismiss | ❌ No | Yes (cleared) |
| New active alert activated | ❌ No | Yes (cleared) |
| New browser tab opened | ❌ No | N/A (isolated) |
| Browser closed and reopened | ❌ No | N/A (cleared by browser) |
| Incognito window | ❌ No | N/A (isolated) |

---

## Alert Priority → Notification Wording

| Alert Priority | Toast Title | Behavior |
|---|---|---|
| Critical | Emergency Resolved | Banner was red; popup was shown |
| Warning | Warning Lifted | Banner was orange; no popup |
| Advisory | Advisory Lifted | Banner was blue; no popup |

---

## Polling Interval

The public site polls the API every **60 seconds**. A resident may see the
"All Clear" toast up to 60 seconds after the admin clicks Resolve, depending
on where in the poll cycle the resolution happens.
