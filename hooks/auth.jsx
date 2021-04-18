import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { find } from '@libs/client/users';
import { get } from '@client/developers';
import { setupAccount } from '@client/authenticate';

const authContext = React.createContext(undefined);

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState();
  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (value) => {
      if (value) {
        // user who logins using provider the first time won't have an account
        const existedUser = await find(value.uid);
        if (!existedUser) {
          await setupAccount(value, value.displayName, 'developer');
          const merged = value && Object.assign(await get(value.uid), value);
          setUser(merged);
        } else {
          const merged = value && Object.assign(existedUser, value);
          setUser(merged);
        }
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
