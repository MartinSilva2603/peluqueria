// Native Browser & Mobile Notification helper for Android
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { supported: false, granted: false, message: 'Tu navegador no soporta notificaciones nativas.' };
  }

  if (Notification.permission === 'granted') {
    return { supported: true, granted: true };
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return { supported: true, granted: permission === 'granted' };
  }

  return { supported: true, granted: false, message: 'Permiso de notificaciones denegado en el navegador.' };
}

export function sendLocalNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notif = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      ...options
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (err) {
    console.warn("Notification error:", err);
    return false;
  }
}
