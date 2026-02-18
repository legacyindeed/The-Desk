// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// REPLACE these values with your own from the Firebase Console!
const firebaseConfig = {
    apiKey: "AIzaSyDqd_7sESMrPfDhbo1LQGYnmUUyvEn07gQ",
    authDomain: "the-desk-dee23.firebaseapp.com",
    projectId: "the-desk-dee23",
    storageBucket: "the-desk-dee23.firebasestorage.app",
    messagingSenderId: "505043654634",
    appId: "1:505043654634:web:8043a07933d1d809eb0493",
    measurementId: "G-Z3W2549JE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
