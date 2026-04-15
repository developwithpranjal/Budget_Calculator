import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ9zJ62Iw6DQ7LmRuWsnMJ6Sfu-3uqh2M",
  authDomain: "expenso-50e48.firebaseapp.com",
  projectId: "expenso-50e48",
  storageBucket: "expenso-50e48.firebasestorage.app",
  messagingSenderId: "887227373262",
  appId: "1:887227373262:web:a5fef5b7d0d2b91d59e29f",
  measurementId: "G-0GNBMKDMJT",
  
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);