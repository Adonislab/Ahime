// lib/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBiJATjqn3kX-xWuHRbFEnmxMCVEOS5730",
  authDomain: "ahime-333cc.firebaseapp.com",
  projectId: "ahime-333cc",
  storageBucket: "ahime-333cc.appspot.com",
  messagingSenderId: "842609310871",
  appId: "1:842609310871:web:2bd1bae4bce0d62e80bdd2",
  measurementId: "G-2ZBE86F4R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
