import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/auth';
import { FirebaseAuth } from '../libs/firebase_client';

export default function AccountVerification({ email }) {
  const router = useRouter();
  const user = useAuth();
  useEffect(() => {
    if (user && user.email !== email) {
      // sign out current user
      FirebaseAuth().signOut();
      router.replace('/login');
    } else router.replace('/');
  }, []);
  return (
    <Grid container justify="center" alignContent="center" alignItems="center">
      <Grid item>
        <Typography variant="h3" align="center">
          Redirecting...
        </Typography>
      </Grid>
    </Grid>
  );
}

AccountVerification.propTypes = {
  email: PropTypes.string,
};
AccountVerification.defaultProps = {
  email: '',
};

export async function getServerSideProps({ query }) {
  if (!query.email) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      email: query.email,
    },
  };
}
