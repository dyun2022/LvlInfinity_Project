import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZoqGjlJme7RL04ebFmYiMAQPRvLHvCKM",
    authDomain: "gennodes.firebaseapp.com",
    projectId: "gennodes",
    storageBucket: "gennodes.firebasestorage.app",
    messagingSenderId: "868579694718",
    appId: "1:868579694718:web:55861fa37515869404e02f",
    measurementId: "G-Q3KXNHM59F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
