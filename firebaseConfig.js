// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC2vtsHewxW9aQERql_cOeIc-jv7V_OzvM",
  authDomain: "projectpracticumyear3.firebaseapp.com",
  projectId: "projectpracticumyear3",
  storageBucket: "projectpracticumyear3.firebasestorage.app",
  messagingSenderId: "718271264608",
  appId: "1:718271264608:web:699c7e367d16f5edf55005",
  measurementId: "G-ZTSW3R806J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);