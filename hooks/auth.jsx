import * as React from 'react';
import PropTypes from 'prop-types';
import { FirebaseAuth } from '@libs/client/firebase';
import { find } from '@libs/client/users';

const AuthContext = React.createContext({
  user: null,
  update: () => {},
});

export default function AuthProvider({ children }) {
  const [user, update] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = FirebaseAuth().onAuthStateChanged(async (value) => {
      if (value) {
        update(await find(value.uid));
        unsubscribe();
      }
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return React.useContext(AuthContext);
}

export function logout() {
  return FirebaseAuth().signOut();
}
