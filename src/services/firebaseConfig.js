import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6o4Ihw18pDNYbzrecbo5D-n8tzoaYv7c",
  authDomain: "luctreportingapp-2f216.firebaseapp.com",
  projectId: "luctreportingapp-2f216",
  storageBucket: "luctreportingapp-2f216.firebasestorage.app",
  messagingSenderId: "418010890685",
  appId: "1:418010890685:web:9afb1141bdb1d1193dd2d4",
  measurementId: "G-2P0E22Y55Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);