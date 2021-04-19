import * as React from 'react';
import PropTypes from 'prop-types';
import Footer from '@components/Footer';
import { CompanyAppBar, DeveloperAppBar, GuestAppBar } from '../AppBar';
import { useAuth } from '../../hooks/auth';

export default function Layout({ children }) {
  const user = useAuth();
  const AppBar = getLayout(user?.role);

  return (
    <>
      <AppBar />
      <main style={{minHeight : "100vh"}}>
        {children}
      </main>
      <Footer/>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function getLayout(role) {
  switch (role) {
    case 'company':
      return CompanyAppBar;
    case 'developer':
      return DeveloperAppBar;
    default:
      return GuestAppBar;
  }
}
