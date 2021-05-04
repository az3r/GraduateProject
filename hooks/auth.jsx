import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { find } from '@libs/client/users';

const authContext = React.createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (value) => {
      // magic
      setTimeout(async () => {
        if (value) {
          const signedInUser = await find(value.uid);
          if (signedInUser) {
            delete signedInUser.email;
            setUser(Object.assign(value, signedInUser));
          }
        }
        setUser(value);
      }, 1000);
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
