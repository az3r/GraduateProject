import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { findUser } from '@libs/client/refactor-users';

const authContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (value) => {
      const merged = Object.assign(value, findUser(value.uid));
      setUser(merged);
    });
    return unsubscribe;
  }, []);
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
