// import React, { useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { parseCookies } from '@libs/client/cookies';
// import { useRouter } from 'next/router';
// import { get } from '@libs/client/exams';
// import { users } from '@libs/client';
// import AppLayout from '../../../components/Layout';

// const UpdateExamination = dynamic(
//   () => import('../../../components/Examiner/Examinations/UpdateExamination'),
//   { ssr: false }
// );

// export default function Update({ user, exam }) {
//   const router = useRouter();
//   useEffect(() => {
//     if (Object.keys(user).length === 0) {
//       router.replace('/login');
//     }
//     if (Object.keys(exam).length === 0) {
//       router.replace('/examiner/examinations');
//     }
//   }, []);
//   return (
//     <>
//       <AppLayout>
//         {Object.keys(exam).length !== 0 ? (
//           <UpdateExamination user={user} examProps={exam} />
//         ) : null}
//       </AppLayout>
//     </>
//   );
// }

// export async function getServerSideProps({ req, query }) {
//   const cookies = parseCookies(req);
//   if (Object.keys(cookies).length !== 0) {
//     if (cookies.user) {
//       const user = await users.get(JSON.parse(cookies.user).uid);
//       if(user.role === 'company')
//       {
//         const { id } = query;
//         const exam = await get(id, { withProblems: true });
//         if (exam) {
//           if (user.id === exam.owner && Date.parse(exam.startAt) > Date.now()) {
//             return {
//               props: {
//                 user,
//                 exam,
//               },
//             };
//           }
//         }
//         return {
//           props: {
//             user,
//             exam: '',
//           },
//         };
//       }
//     }
//   }
//   return {
//     props: {
//       user: '',
//       exam: '',
//     },
//   };
// }
