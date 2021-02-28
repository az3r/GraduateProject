import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '../libs/firebase_client';

const authContext = React.createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  FirebaseAuth().onAuthStateChanged((newUser) => {
    setUser(newUser);
  });
  return <authContext.Provider value={user}>{children}</authContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return React.useContext(authContext);
}

export function logout() {
  return FirebaseAuth().signOut();
}
