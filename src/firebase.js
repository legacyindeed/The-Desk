// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDqd_7sESMrPfDhbo1LQGYnmUUyvEn07gQ",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "the-desk-dee23.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "the-desk-dee23",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "the-desk-dee23.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "505043654634",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:505043654634:web:8043a07933d1d809eb0493",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Z3W2549JE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
