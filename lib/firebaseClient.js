// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi0MgQA4Q6oQcTWh3kDglqAq6d-iTAz-w",
  authDomain: "educedge-29d72.firebaseapp.com",
  projectId: "educedge-29d72",
  storageBucket: "educedge-29d72.firebasestorage.app",
  messagingSenderId: "144520835528",
  appId: "1:144520835528:web:ab5bf53a020fd9894a50fd",
  measurementId: "G-WFGSBT22FK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
