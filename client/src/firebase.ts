import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6X6uRpuJ4DCzkgYpXEzuN6zRXTR74fVs",
  authDomain: "aarthik-c3351.firebaseapp.com",
  projectId: "aarthik-c3351",
  storageBucket: "aarthik-c3351.firebasestorage.app",
  messagingSenderId: "644240507088",
  appId: "1:644240507088:web:2adf8af70daabde9091ed5",
  measurementId: "G-JS6VK1E8J3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
