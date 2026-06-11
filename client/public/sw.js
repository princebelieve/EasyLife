// eslint-disable-next-line no-unused-vars
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request, {
      cache: "no-store",
      credentials: "same-origin",
    }),
  );
});

/**
 * Handle incoming push notifications
 */
self.addEventListener("push", (event) => {
  try {
    const data = event.data ? event.data.json() : {};

    const options = {
      body: data.body || "You have a new notification",
      icon: data.icon || "/logo.jpeg",
      badge: data.badge || "/logo.jpeg",
      tag: data.tag || "notification",
      requireInteraction: data.requireInteraction || false,
      data: data.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || "NewBrend Furniture",
        options,
      ),
    );

    if (typeof data.data?.badgeCount === "number") {
      event.waitUntil(
        (async () => {
          if (self.registration && "setAppBadge" in self.registration) {
            if (data.data.badgeCount > 0) {
              await self.registration.setAppBadge(data.data.badgeCount);
            } else if ("clearAppBadge" in self.registration) {
              await self.registration.clearAppBadge();
            }
          }
        })(),
      );
    }
  } catch (error) {
    console.error("Error handling push event:", error);
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window/tab with the target URL
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === link && "focus" in client) {
            return client.focus();
          }
        }

        // If not, open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(link);
        }
      }),
  );
});

/**
 * Handle notification close
 */
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});
