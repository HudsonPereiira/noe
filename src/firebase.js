// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTq70ATENIh6MfkJ4VCrAZRaWDuFkWvVQ",
  authDomain: "noe-fe33e.firebaseapp.com",
  projectId: "noe-fe33e",
  storageBucket: "noe-fe33e.firebasestorage.app",
  messagingSenderId: "930668511977",
  appId: "1:930668511977:web:66705f6dc0ed5ccb412678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };