// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBtjhdDmEQMMYA9wLSsGRSRt5SkmhMF2bs",
    authDomain: "tab-v-s-group.firebaseapp.com",
    projectId: "tab-v-s-group",
    storageBucket: "tab-v-s-group.firebasestorage.app",
    messagingSenderId: "970781941972",
    appId: "1:970781941972:web:e6aa7cf78686cc9a895b41",
    measurementId: "G-62YTV7T7WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);