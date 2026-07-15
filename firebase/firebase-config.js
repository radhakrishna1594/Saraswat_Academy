// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4qPMqu1AYT9hxHwc2TW1-8ZU3OmNcyAo",
    authDomain: "saraswat-academy-ebe0b.firebaseapp.com",
    projectId: "saraswat-academy-ebe0b",
    storageBucket: "saraswat-academy-ebe0b.firebasestorage.app",
    messagingSenderId: "1010725520315",
    appId: "1:1010725520315:web:70941ae273021111893a9e",
    measurementId: "G-0JXS778VDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export { app, auth, db };