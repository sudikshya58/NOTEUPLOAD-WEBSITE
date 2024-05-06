// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKya87E5NyzXBXh-ioACTG_cHnG5K61W4",
  authDomain: "noteupload-346ee.firebaseapp.com",
  projectId: "noteupload-346ee",
  storageBucket: "noteupload-346ee.appspot.com",
  messagingSenderId: "940152695172",
  appId: "1:940152695172:web:9d3e458c44b5b4194755d1",
  measurementId: "G-X74G54KG4S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage=getStorage(app)