import * as React from 'react';
import PropTypes from 'prop-types';
import { MemberAppBar, GuestAppBar } from '../AppBar';
import { useAuth } from '../../hooks/auth';

export default function Layout({ children }) {
  const user = useAuth();

  return (
    <>
      {user ? <MemberAppBar /> : <GuestAppBar />}
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
