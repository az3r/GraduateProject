// import React, { useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { parseCookies } from '@libs/client/cookies';
// import { get } from '@libs/client/exams';
// import { useRouter } from 'next/router';
// import { users } from '@libs/client';
// import AppLayout from '../../../components/Layout';

// const DetailExamination = dynamic(
//   () => import('../../../components/Examiner/Examinations/DetailExamination'),
//   { ssr: false }
// );

// export default function ExaminationDetail({ user, exam }) {
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
//           <DetailExamination user={user} exam={exam} />
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
//           if (user.id === exam.owner) {
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
