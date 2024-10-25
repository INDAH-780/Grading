// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrnC1VmYfZd2fkWLGrZDoMUNDopzcWG6E",
  authDomain: "essay-grading-system-ffbf7.firebaseapp.com",
  projectId: "essay-grading-system-ffbf7",
  storageBucket: "essay-grading-system-ffbf7.appspot.com",
  messagingSenderId: "195479267531",
  appId: "1:195479267531:web:75567b03e65c613e34534e",
  measurementId: "G-QYDFW6VH36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export default app;
