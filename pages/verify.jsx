import { Typography } from '@material-ui/core';
import * as React from 'react';

export default function AccountVerification({ uid }) {
  if (uid === undefined)
    return <Typography variant="h1">missing uid</Typography>;
}
export async function getServerSideProps({ query }) {
  if (query.uid) {
    return {
      redirect: {
        destination: '/login',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
}
