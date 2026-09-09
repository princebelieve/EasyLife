/**
 * Subscribe user to push notifications
 * Called after service worker registration
 */
async function subscribeToPush(registration) {
  try {
    if (Notification.permission !== "granted") {
      console.log(
        "Notification permission not granted; skipping push subscription",
      );
      return;
    }

    // Check if push messaging is supported
    if (!("pushManager" in registration)) {
      console.log("Push notifications not supported on this browser");
      return;
    }

    // Do not create a subscription until it can be associated with a signed-in
    // user. Existing subscriptions must still be synchronised after login.
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("User not authenticated, skipping push subscription");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const vapidResponse = await fetch(`${apiUrl}/api/push/vapid-public-key`);
    if (!vapidResponse.ok) {
      console.log("VAPID key not available on server");
      return;
    }

    const { publicKey } = await vapidResponse.json();
    if (!publicKey) {
      console.log("No VAPID public key received");
      return;
    }

    const applicationServerKey = urlBase64ToUint8Array(publicKey);
    let subscription = await registration.pushManager.getSubscription();

    // A subscription is bound to the VAPID public key it was created with.
    // If deployment keys are rotated, retaining the old subscription makes
    // every server-side push fail. Recreate it automatically in that case.
    if (
      subscription &&
      !subscriptionMatchesVapidKey(subscription, applicationServerKey)
    ) {
      const unsubscribed = await subscription.unsubscribe();
      if (!unsubscribed) {
        console.warn("Unable to refresh outdated push subscription");
        return;
      }
      subscription = null;
    }

    if (!subscription) {

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }

    // Always send the current endpoint to the API, including endpoints retained
    // by the browser across refreshes.
    const subscribeResponse = await fetch(`${apiUrl}/api/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription }),
    });

    if (subscribeResponse.ok) {
      console.log("✅ Subscribed to push notifications");
    } else {
      console.warn("Failed to save subscription to server");
    }
  } catch (error) {
    console.warn("Failed to subscribe to push notifications:", error);
  }
}

export async function ensurePushSubscription() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await subscribeToPush(registration);
  } catch (error) {
    console.warn("Failed to ensure push subscription:", error);
  }
}

/**
 * Convert VAPID public key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function subscriptionMatchesVapidKey(subscription, expectedKey) {
  const currentKey = subscription.options?.applicationServerKey;

  // Older browsers may not expose this option. Preserve a working
  // subscription rather than unnecessarily removing it in those browsers.
  if (!currentKey) {
    return true;
  }

  const currentKeyBytes = new Uint8Array(currentKey);
  return (
    currentKeyBytes.length === expectedKey.length &&
    currentKeyBytes.every((byte, index) => byte === expectedKey[index])
  );
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("Service worker registered:", registration.scope);
        subscribeToPush(registration);
      })
      .catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
  });
}
