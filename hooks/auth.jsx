import * as React from "react";
import { FirebaseAuth } from "../libs/firebase_client";
const authContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  FirebaseAuth().onAuthStateChanged((user) => {
    setUser(user);
  });
  return <authContext.Provider value={user}>{children}</authContext.Provider>;
}

export function useAuth() {
  return React.useContext(authContext);
}
