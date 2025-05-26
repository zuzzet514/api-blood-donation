import initializeApp from "./app.js";

initializeApp()
    .then(() => {
        console.log('App initialized successfully');
    })
    .catch((error) => {
        console.error('Failed to initialize app:', error);
    });
