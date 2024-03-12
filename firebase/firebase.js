// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxLPRq44gKYyKuyiQreFN1NR0kJTGlC1Q",
  authDomain: "tbdfridge.firebaseapp.com",
  projectId: "tbdfridge",
  storageBucket: "tbdfridge.appspot.com",
  messagingSenderId: "805582660558",
  appId: "1:805582660558:web:bd353524e9776cfaebc19f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };