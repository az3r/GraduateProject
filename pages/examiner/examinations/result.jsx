import React, { useEffect } from 'react';
// import dynamic from 'next/dynamic';
import { parseCookies } from '@libs/client/cookies';
import { useRouter } from 'next/router';
import { users } from '@libs/client';
import { getExamSubmissions } from '@libs/client/submissions';
import ResultPage from '@components/Examiner/Examinations/ResultPage';
import { get } from '@libs/client/users';
import AppLayout from '../../../components/Layout';

export default function Index({ user, examinee, result}) {
  const router = useRouter();
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.replace('/examiner');
    }
  }, []);
  return (
    <>
      <AppLayout>
            <ResultPage examinee={examinee} result={result}/>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = parseCookies(req);
  if (Object.keys(cookies).length !== 0) {
    if (cookies.user) {
      const user = await users.get(JSON.parse(cookies.user).uid);
      if(user.role === 'company')
      {
        const { id,uid } = query;
        const examinee = await get(uid);
        const result = await getExamSubmissions(uid,id);
        if (result) {
            return {
                props:{
                    user,
                    examinee,
                    result: result[0]
                }
            }
        }
        return {
          props: {
            user,
            result: '',
          },
        };
      }
    }
  }
  return {
    props: {
      user: '',
      result: '',
    },
  };
}
