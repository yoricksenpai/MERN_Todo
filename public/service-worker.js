/* eslint-env serviceworker */
// Événement déclenché lorsque le Service Worker reçoit une notification push
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Notification reçue.');

    // Récupération des données envoyées avec la notification
    const data = event.data ? event.data.json() : {};
    console.log('[Service Worker] Données de la notification:', data);

    // Définir les options de la notification
    const options = {
        body: data.body || 'Vous avez une nouvelle notification.',
        icon: '/icon.png', // Icône de la notification (placez un fichier icon.png dans public/)
        badge: '/badge.png', // Badge (spécifique pour les appareils mobiles, optionnel)
        data: {
            url: data.url || '/', // URL à ouvrir lorsque l'utilisateur clique sur la notification
        },
    };

    // Afficher la notification
    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

// Événement déclenché lorsque l'utilisateur clique sur une notification
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Clic sur la notification.');

    // Fermer la notification
    event.notification.close();

    // Ouvrir ou rediriger vers l'URL spécifiée
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            const urlToOpen = event.notification.data.url || '/';

            // Vérifier si une fenêtre correspondante est déjà ouverte
            const matchingClient = clientList.find((client) => client.url === urlToOpen);
            if (matchingClient) {
                // Mettre en avant la fenêtre correspondante
                return matchingClient.focus();
            } else {
                // Ouvrir une nouvelle fenêtre avec l'URL
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});

// Optionnel : Gestion des autres événements du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activé.');
});

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installé.');
});
