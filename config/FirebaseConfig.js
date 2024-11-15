// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "sucommunityapp.firebaseapp.com",
  projectId: "sucommunityapp",
  storageBucket: "sucommunityapp.appspot.com",
  messagingSenderId: "296291892019",
  appId: "1:296291892019:web:dce15ec0512cd7b1679c46",
  measurementId: "G-RYYJMJZYCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Firebase Firestore initialization

export { db };
