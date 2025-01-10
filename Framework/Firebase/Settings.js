import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/compat/storage';
import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyAoBVX10QIWGPt6BeOjwPWI8-I1xhhjOi8",
    authDomain: "tipngoal.firebaseapp.com",
    projectId: "tipngoal",
    storageBucket: "tipngoal.firebasestorage.app",
    messagingSenderId: "371236077302",
    appId: "1:371236077302:web:80890da36cfb4de904b6d7"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const imgStorage = firebase.storage;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Firestore and enable persistence
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Enable persistence for offline mode
enableIndexedDbPersistence(db).catch((error) => {
  if (error.code === 'failed-precondition') {
    console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
  } else if (error.code === 'unimplemented') {
    console.log("The current browser does not support all of the features required to enable persistence.");
  }
});

export { auth, db };
