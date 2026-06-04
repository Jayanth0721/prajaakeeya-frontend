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

// Build the in-app path to open for a tapped notification. Prefer an explicit
// `link` from the payload; otherwise derive one from the notification type +
// ids, mirroring the in-app routing in src/pages/NotificationsPage.tsx. Falls
// back to "/" so a tap always at least opens the web app.
function resolveTarget(data) {
  if (data.link) return data.link;
  const aspirantId = data.aspirantId;
  const electionId = data.electionId;
  switch (data.type) {
    case "civic_issue":
      return "/user/civic-issues";
    case "new_aspirant":
      return aspirantId ? `/user/aspirants/${aspirantId}/view` : "/user/aspirantslist";
    case "chat_message":
      return aspirantId ? `/user/chat/${aspirantId}` : "/user/aspirantslist";
    case "meeting":
      return "/user/dashboard/meetings";
    case "voting_window":
      return "/user/aspirantslist";
    case "aspirant_meeting":
    case "aspirant_visit":
    case "meeting_started":
    case "meeting_reminder": {
      const params = new URLSearchParams();
      if (electionId) params.set("electionId", String(electionId));
      if (aspirantId) params.set("aspirantId", String(aspirantId));
      const qs = params.toString();
      return qs ? `/user/aspirantslist?${qs}` : "/user/aspirantslist";
    }
    default:
      return "/";
  }
}

// Navigate the web app when a notification is tapped. If a tab is already open,
// ask the page to route in-app (this SW is at a separate scope and can't call
// client.navigate()); otherwise open a fresh window at the deep link.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const path = resolveTarget(data);
  const targetUrl = new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (new URL(client.url).origin !== self.location.origin) continue;
          client.postMessage({ type: "NOTIFICATION_NAVIGATE", url: path });
          return "focus" in client ? client.focus() : undefined;
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      }),
  );
});
