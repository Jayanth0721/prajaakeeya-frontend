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

if (
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
) {
  firebase.initializeApp(firebaseConfig);
  // Initialising messaging() installs FCM's default background handler, which
  // auto-displays `notification` / `webpush.notification` payloads. We do NOT
  // register onBackgroundMessage — that would duplicate the auto-shown banner.
  firebase.messaging();
}

// Activate a new version of this SW immediately instead of waiting for every
// tab to close — so push/click fixes reach devices on the next visit, not days
// later. (This SW lives at its own scope and controls no pages, so claiming is
// harmless.)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// ─── TEMPORARY DEBUG — remove once push payloads are confirmed ───────────────
// Logs the RAW push payload exactly as the backend sent it (notification + data
// blocks), so we can see whether the routing ids (type/aspirantId/electionId)
// are present. View in DevTools → Application → Service Workers → "inspect" on
// firebase-messaging-sw.js → Console.
self.addEventListener("push", (event) => {
  try {
    console.log("[push DEBUG] raw payload:", event.data ? event.data.json() : null);
  } catch (e) {
    console.log("[push DEBUG] payload (text):", event.data && event.data.text());
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// Notification-tap navigation is handled by the Firebase SDK's built-in
// notificationclick handler, which opens `webpush.fcm_options.link` (set by the
// backend, FirebaseService → an absolute https deep link). We deliberately do
// NOT add a competing navigation handler here — a second openWindow would
// double-open / race the SDK's. This listener is diagnostic-only: it logs so we
// can confirm in the SW console whether the tap reaches the service worker
// (useful for the Android TWA case). Remove the log once confirmed.
self.addEventListener("notificationclick", (event) => {
  console.log(
    "[push DEBUG] notificationclick fired. data:",
    event.notification && event.notification.data,
  );
});
