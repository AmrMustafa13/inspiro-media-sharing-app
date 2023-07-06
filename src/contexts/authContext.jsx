import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
