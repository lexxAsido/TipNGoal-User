


// import { createContext, useState } from "react";


// const AppContext = createContext();

// function AppProvider({ children }) {
//     const [docID, setDocID] = useState("");
//     const [doc, setDoc] = useState("");
//     const [userUID, setUserUID] = useState("");
//     const [preloader, setPreloader] = useState(false);
//     const [userInfo, setUserInfo] = useState({ image: null, firstname: "John", lastname: "Wick", email: "john@gmail.com" });

//     return (
//         <AppContext.Provider value={{
//             docID, setDocID,
//             userUID, setUserUID,
//             doc, setDoc,
//             userInfo, setUserInfo,
//             preloader, setPreloader,
//         }}>
//             {children}
//         </AppContext.Provider>
//     )
// }

// export { AppContext, AppProvider }

import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../Firebase/Settings';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [userUID, setUserUID] = useState("");
  const [userInfo, setUserInfo] = useState({image: null, firstname: "John", lastname: "Wick", email: "john@gmail.com" });
  const [preloader, setPreloader] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid);
        fetchUserInfo(user.uid); 
      } else {
        setUserUID(null);
        setUserInfo(null); 
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserInfo = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <AppContext.Provider value={{ userUID, setUserUID, userInfo, setUserInfo, preloader, setPreloader }}>
      {children}
    </AppContext.Provider>
  );
}
