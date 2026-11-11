// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfZFWGD43N3DtvtKOa4WzDzMuW555lnHY",
  authDomain: "infotabvsgroup.firebaseapp.com",
  projectId: "infotabvsgroup",
  storageBucket: "infotabvsgroup.firebasestorage.app",
  messagingSenderId: "536510785582",
  appId: "1:536510785582:web:3aa99f8c73ad61af91d7bf",
  measurementId: "G-ZRD9F7YL1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);