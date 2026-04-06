// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Create the Auth context
export const AuthContext = createContext();

// AuthProvider wraps the app to provide user, role, and loading state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      console.log("Auth state changed:", userAuth);
      setLoading(true);

      if (userAuth) {
        setUser(userAuth);

        try {
          // Fetch user role from Firestore
          const docRef = doc(db, "users", userAuth.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data from Firestore:", userData);
            setRole(userData.role || null);
          } else {
            console.warn("No user document found in Firestore");
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user document:", error.message);
          setRole(null);
        }
      } else {
        // No user logged in
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Provide context values
  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};