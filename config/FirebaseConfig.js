// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "sucommunityapp.firebaseapp.com",
  projectId: "sucommunityapp",
  storageBucket: "sucommunityapp.firebasestorage.app",
  messagingSenderId: "296291892019",
  appId: "1:296291892019:web:dce15ec0512cd7b1679c46",
  measurementId: "G-RYYJMJZYCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);