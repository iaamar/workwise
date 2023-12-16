// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "workwise-bb276.firebaseapp.com",
  projectId: "workwise-bb276",
  storageBucket: "workwise-bb276.appspot.com",
  messagingSenderId: "289405333522",
  appId: "1:289405333522:web:9cb625a34d6aa11e9268cb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
