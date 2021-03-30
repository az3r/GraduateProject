import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { get } from '@libs/client/users';

const authContext = React.createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (auth) => {
      const newUser = await get(auth.uid);
      setUser(newUser);
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
