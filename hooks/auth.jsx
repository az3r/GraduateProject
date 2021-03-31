import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { get } from '@libs/client/users';

const authContext = React.createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(undefined);
  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (auth) => {
      if (auth) {
        const newUser = await get(auth.uid);
        // in first time login, user hasn't created in firestore yet
        if (newUser === undefined) {
          setUser({
            name: auth.displayName,
            avatar: auth.photoURL,
            id: auth.uid,
            role: 'developer',
          });
        } else setUser(newUser);
      } else setUser(undefined);
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
