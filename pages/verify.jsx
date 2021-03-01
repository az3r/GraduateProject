import * as React from 'react';

export default function AccountVerification() {
  return <p>Redirecting...</p>;
}
export async function getServerSideProps({ query }) {
  if (!query.uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      uid: query.uid,
    },
  };
}
