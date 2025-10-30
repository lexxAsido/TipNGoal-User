import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import 'firebase/compat/storage';
import firebase from "firebase/compat/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 


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

const app = initializeApp(firebaseConfig);

export const imgStorage = firebase.storage;
export const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  
});


const db = initializeFirestore(app, {
    cacheSizeBytes: 1048576,  
    experimentalForceLongPolling: true  
});

export { auth, db };
