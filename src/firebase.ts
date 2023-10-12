// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6ht9ig6jiBd4QddelWwknyOfMsKAblfI",
  authDomain: "study-firebase-with-reac-b5726.firebaseapp.com",
  projectId: "study-firebase-with-reac-b5726",
  storageBucket: "study-firebase-with-reac-b5726.appspot.com",
  messagingSenderId: "1015637601148",
  appId: "1:1015637601148:web:ef69916b362b2a53b712f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
