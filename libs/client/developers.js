import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';
import { Firestore } from './firebase';

/** get a developer and its private attirbutes */
export async function get(uid) {
  const document = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .get();

  if (document.data() === undefined) {
    return undefined;
  }

  const attributes = await getAttributeReference(
    collections.developers,
    uid
  ).get();

  return transform(document, attributes);
}

/** get all developers' basic info */
export async function getAll() {
  const developers = await Firestore().collection(collections.developers).get();
  return developers.docs.map((dev) => transform(dev));
}

export async function update(
  uid,
  { websites, location, gender, birthday, technicalSkills, experiences }
) {
  await getAttributeReference(collections.developers, uid).update({
    websites,
    location,
    gender,
    birthday,
    technicalSkills,
    experiences,
  });
}

/** get exams' basic info in which developer participated */
export async function getJoinedExams(developer) {
  if (developer?.joinedExams?.length > 0) {
    const snapshot = await Firestore()
      .collection(collections.exams)
      .where(Firestore.FieldPath.documentId(), 'in', developer.joinedExams)
      .get();

    return snapshot.docs.map((doc) => transform(doc));
  }

  return [];
}

export async function joinExam(uid, examId) {
  // add user to exam's participants
  await getAttributeReference(collections.exams, examId).update({
    participants: Firestore.FieldValue.arrayUnion(uid),
  });

  // add exam to user's particated exams
  return getAttributeReference(collections.developers, uid).update({
    joinedExams: Firestore.FieldValue.arrayUnion(examId),
  });
}

export async function leaveExam(uid, examId) {
  // remove user from exam's participants
  await getAttributeReference(collections.exams, examId).update({
    participants: Firestore.FieldValue.arrayRemove(uid),
  });

  // remove exam from user's particated exams
  return getAttributeReference(collections.developers, uid).update({
    joinedExams: Firestore.FieldValue.arrayRemove(examId),
  });
}

export async function addSolvedProblem(
  developer,
  { problemId, score, status }
) {
  const ref = Firestore().collection(collections.developers).doc(developer.id);

  // add or update problem in user's solveProblems collection
  const problem = await ref
    .collection(collections.solvedProblems)
    .doc(problemId)
    .get();
  if (problem.exists) {
    if (status === 'Solved') {
      await problem.ref.update({
        modifiedAt: Firestore.Timestamp.now(),
        score,
        status,
      });
    } else if (problem.get('score') <= score) {
      await problem.ref.update({
        modifiedAt: Firestore.Timestamp.now(),
        score,
        status,
      });
    } else {
      return;
    }
  } else {
    await problem.ref.set({
      createdOn: Firestore.Timestamp.now(),
      score,
      status,
    });
  }

  // update total problem score
  await ref.update({
    problemScore:
      (developer.problemScore === undefined ? 0 : developer.problemScore) -
      (problem.exists ? problem.get('score') : 0) +
      score,
  });
}

export async function getUserByExamScore() {
  const result = await Firestore()
    .collection(collections.developers)
    .orderBy('examScore', 'desc')
    .orderBy('name', 'asc')
    .orderBy(Firestore.FieldPath.documentId(), 'asc')
    .get();

  const users = [];

  for (let i = 0; i < result.docs.length; i += 1) {
    const doc = transform(result.docs[i]);
    const attributes = await getAttributeReference(
      collections.developers,
      doc.id
    ).get();
    users.push(transform(result.docs[i], attributes));
  }

  return users;
}

export async function getSolvedProblems(uid) {
  const ids = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .collection(collections.solvedProblems)
    .where('status', '==', 'Solved')
    .get();

  if (ids.docs.length === 0) {
    return [];
  }

  const problems = await Firestore()
    .collection(collections.problems)
    .where(
      Firestore.FieldPath.documentId(),
      'in',
      ids.docs.map((item) => item.id)
    )
    .get();
  return problems.docs.map((doc) => transform(doc));
}

export async function getUnsolvedProblems(uid) {
  const ids = await Firestore()
    .collection(collections.developers)
    .doc(uid)
    .collection(collections.solvedProblems)
    .where('status', '==', 'Unsolved')
    .get();

  if (ids.docs.length === 0) {
    return [];
  }

  const problems = await Firestore()
    .collection(collections.problems)
    .where(
      Firestore.FieldPath.documentId(),
      'in',
      ids.docs.map((item) => item.id)
    )
    .get();
  return problems.docs.map((doc) => transform(doc));
}

export async function createProblemSubmission(
  developerId,
  { problemId, problemName, language, status, code, data }
) {
  const { id } = await Firestore()
    .collection(collections.developers)
    .doc(developerId)
    .collection(collections.problemSubmissions)
    .add({
      ...data,
      problemId,
      problemName,
      language,
      code,
      status,
      createdOn: Firestore.Timestamp.now(),
    });

  // add user to problem's participants
  const ref = getAttributeReference(collections.problems, problemId);
  const attributes = await ref.get();
  if (attributes.get('participants')?.includes(developerId)) return id;
  await ref.update({
    participants: Firestore.FieldValue.arrayUnion(developerId),
  });
  return id;
}

export async function getAllProblemSubmissions(developerId, isAccepted) {
  let submissions;
  if (isAccepted === false) {
    submissions = await Firestore()
      .collection(collections.developers)
      .doc(developerId)
      .collection(collections.problemSubmissions)
      .orderBy('createdOn', 'desc')
      .get();
  } else {
    submissions = await Firestore()
      .collection(collections.developers)
      .doc(developerId)
      .collection(collections.problemSubmissions)
      .where('status', '==', 'Accepted')
      .orderBy('createdOn', 'desc')
      .get();
  }

  return submissions.docs.map((submit) => transform(submit));
}

export async function getProblemSubmissions(developerId, problemId) {
  const snapshot = await Firestore()
    .collection(collections.developers)
    .doc(developerId)
    .collection(collections.problemSubmissions)
    .where('problemId', '==', problemId)
    .orderBy('createdOn', 'desc')
    .get();

  return snapshot.docs.map((doc) => transform(doc));
}

export async function getProblemSubmissionDetails(
  developerId,
  problemSubmissionId
) {
  const snapshot = await Firestore()
    .collection(collections.developers)
    .doc(developerId)
    .collection(collections.problemSubmissions)
    .doc(problemSubmissionId)
    .get();

  return transform(snapshot);
}

export async function getAllExamResults(developerId) {
  const submissions = await Firestore()
    .collection(collections.developers)
    .doc(developerId)
    .collection(collections.examSubmissions)
    .orderBy('createdOn', 'desc')
    .get();
  return submissions.docs.map((submit) => transform(submit));
}

export async function getExamResults(developerId, examId) {
  const snapshot = await Firestore()
    .collection(collections.developers)
    .doc(developerId)
    .collection(collections.examSubmissions)
    .where('examId', '==', examId)
    .orderBy('createdOn', 'desc')
    .get();

  if (snapshot.docs.length === 0) {
    return [];
  }

  return snapshot.docs.map((doc) => transform(doc));
}

export async function createExamSubmission(
  developer,
  { examId, total, correct, results, score, time }
) {
  const { id } = await Firestore()
    .collection(collections.developers)
    .doc(developer.id)
    .collection(collections.examSubmissions)
    .add({
      examId,
      total,
      correct,
      createdOn: Firestore.Timestamp.now(),
      results,
      score,
      time,
    });

  const ref = Firestore().collection(collections.developers).doc(developer.id);

  // update total score
  await ref.update({
    examScore:
      (developer.examScore === undefined ? 0 : developer.examScore) + score,
  });
  return id;
}

/** get all problems of a company created by this developer */
export async function getProblems(companyId, developerId) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('deleted', '==', false)
    .where('companyId', '==', companyId)
    .where('owner', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

/** get all exams of a company created by this developer */
export async function getExams(companyId, developerId) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('deleted', '==', false)
    .where('companyId', '==', companyId)
    .where('owner', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}
