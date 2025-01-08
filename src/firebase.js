import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_XEO4vYN-HAIdqQnAgVw2ukJxONX5LJ8",
  authDomain: "connectify-ef98d.firebaseapp.com",
  projectId: "connectify-ef98d",
  storageBucket: "connectify-ef98d.firebasestorage.app",
  messagingSenderId: "805495637508",
  appId: "1:805495637508:web:b7245d92bc074f5f989751",
};

// this special line of code connects everything so it connects to our database
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
// inside of db we have access to our variable

// authentication - for login support - this give us access to authentication
const auth = getAuth(firebaseApp);

// I need these two variables outside in different files
export { db, auth };
