// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGtktm67Fkt8QgSVavQqxO2Wz1Z4Sj68s",
  authDomain: "lvlinfinity-project.firebaseapp.com",
  projectId: "lvlinfinity-project",
  storageBucket: "lvlinfinity-project.firebasestorage.app",
  messagingSenderId: "758893030679",
  appId: "1:758893030679:web:625ce8e1f078e72e279b52",
  measurementId: "G-3LGQ8F8CLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);