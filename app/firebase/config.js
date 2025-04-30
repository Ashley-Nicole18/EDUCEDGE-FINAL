import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

export { auth };
