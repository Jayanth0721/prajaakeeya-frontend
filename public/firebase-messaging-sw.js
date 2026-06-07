/* Firebase Cloud Messaging service worker — handles BACKGROUND web push.
 *
 * The (public, non-secret) Firebase config is passed via the registration query
 * string from pushNotifications.ts, so it lives in one place (the app env) and
 * isn't duplicated here. This SW is registered at the dedicated FCM scope
 * (/firebase-cloud-messaging-push-scope) so it coexists with the PWA service
 * worker that controls "/".
 */
/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js",
);

const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

// Activate a new version of this SW immediately instead of waiting for every tab
// to close — so push/click fixes reach devices on the next visit, not days later.
// (This SW lives at its own scope and controls no pages, so claiming is harmless.)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// ─── TEMPORARY DEBUG — remove once push routing is confirmed ─────────────────
// Logs the RAW push payload exactly as the backend sent it, so we can confirm
// data.link / type / ids are present. DevTools → Application → Service Workers →
// "inspect" on firebase-messaging-sw.js → Console.
self.addEventListener("push", (event) => {
  try {
    console.log("[push DEBUG] raw payload:", event.data ? event.data.json() : null);
  } catch (e) {
    console.log("[push DEBUG] payload (text):", event.data && event.data.text());
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// Resolve the in-app deep link from the push payload. The backend sends it as a
// RELATIVE path in data.link; FCM may nest the original data under FCM_MSG when
// it auto-displays the notification, so unwrap that. Falls back to the signed-in
// dashboard so a tap always lands somewhere useful.
function notificationLink(data) {
  data = data || {};
  if (data.FCM_MSG && data.FCM_MSG.data) {
    data = { ...data, ...data.FCM_MSG.data };
  }
  return data.link || "/user/dashboard";
}

// Own the notification tap.
//
// CRITICAL ORDERING: this listener is registered BEFORE firebase.messaging()
// (the init block is at the BOTTOM of this file). The FCM compat SDK installs
// its OWN notificationclick handler when messaging() runs, which calls
// stopImmediatePropagation() and can pre-empt a handler registered after it.
// Registering ours first AND calling stopImmediatePropagation() guarantees
// exactly one handler — ours.
//
// Three cases — important for the Android TWA, where using openWindow() to
// navigate an ALREADY-OPEN app is a documented Chromium bug that leaks the deep
// link into an external Chrome tab / a second TWA instance (svgomg-twa#94,
// firebase-js-sdk#2438, crbug 1052288/1076039):
//   1. a tab is already on the target page → focus() it.
//   2. a tab is open on a DIFFERENT page  → focus() + postMessage; the React app
//      navigates in-SPA (in-page JS, so it can NEVER escape the TWA).
//   3. no tab open (app/TWA closed)       → openWindow() the deep link.
// WindowClient.navigate() is NOT usable here (this SW controls no pages, so it
// rejects cross-scope), which is why case 2 routes through the app via postMessage.
self.addEventListener("notificationclick", (event) => {
  event.stopImmediatePropagation();
  event.notification.close();

  const data = (event.notification && event.notification.data) || {};
  const targetUrl = new URL(notificationLink(data), self.location.origin).href;
  const targetPath = new URL(targetUrl).pathname;
  // Relative route (path + query + hash) the in-app React Router understands.
  const targetRoute = (() => {
    const u = new URL(targetUrl);
    return u.pathname + u.search + u.hash;
  })();
  console.log("[push DEBUG] notificationclick →", targetUrl, "data:", data);

  event.waitUntil(
    (async () => {
      let clientList = [];
      try {
        clientList = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
      } catch (e) {
        clientList = [];
      }

      // Same-origin window clients only (never focus/message a cross-origin one).
      const sameOrigin = clientList.filter((c) => {
        try {
          return new URL(c.url).origin === self.location.origin;
        } catch (e) {
          return false;
        }
      });

      // 1) A tab is already on the target page → bring it forward.
      for (const client of sameOrigin) {
        let clientPath = "";
        try {
          clientPath = new URL(client.url).pathname;
        } catch (e) {
          clientPath = "";
        }
        if (clientPath === targetPath && "focus" in client) {
          return client.focus();
        }
      }

      // 2) A tab is open on a DIFFERENT page → focus it, then tell the app to
      //    navigate in-SPA (React Router). Stays inside the TWA.
      if (sameOrigin.length > 0) {
        const client = sameOrigin[0];
        try {
          if ("focus" in client) await client.focus();
        } catch (e) {
          /* focus is best-effort */
        }
        client.postMessage({ type: "PUSH_NAVIGATE", url: targetRoute });
        return undefined;
      }

      // 3) No tab open (app/TWA closed) → cold-start at the deep link.
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })(),
  );
});

// Initialise Firebase Messaging AFTER the notificationclick handler above is
// wired, so the FCM SDK's built-in handler can't pre-empt ours. messaging()
// installs FCM's default background push handler, which auto-displays the
// `notification` / `webpush.notification` payload — we rely on that for display.
if (
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
) {
  firebase.initializeApp(firebaseConfig);
  firebase.messaging();
}
