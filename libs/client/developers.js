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
      .where('deleted', '==', false)
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
    if (status === 'Solved' && problem.get('score') <= score) {
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

  developer.problemScore =
    (developer.problemScore === undefined ? 0 : developer.problemScore) -
    (problem.exists ? problem.get('score') : 0) +
    score;
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
  createProblemSubmission;
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
    .collection(collections.problemSubmissions)
    .add({
      ...data,
      developerId,
      problemId,
      problemName,
      language,
      code,
      status,
      createdOn: Firestore.Timestamp.now(),
    });

  // add to problem's participants
  await Firestore()
    .collection(collections.problems)
    .doc(problemId)
    .update({ participants: Firestore.FieldValue.arrayUnion(developerId) });

  return id;
}

export async function getAllProblemSubmissions(developerId, isAccepted) {
  let submissions;
  if (isAccepted === false) {
    submissions = await Firestore()
      .collection(collections.problemSubmissions)
      .where('developerId', '==', developerId)
      .orderBy('createdOn', 'desc')
      .get();
  } else {
    submissions = await Firestore()
      .collection(collections.problemSubmissions)
      .where('developerId', '==', developerId)
      .where('status', '==', 'Accepted')
      .orderBy('createdOn', 'desc')
      .get();
  }
  return submissions.docs.map((submit) => transform(submit));
}

export async function getProblemSubmissions(developerId, problemId) {
  // get submissions
  const submissions = await Firestore()
    .collection(collections.problemSubmissions)
    .where('problemId', '==', problemId)
    .where('developerId', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get();
  return submissions.docs.map((doc) => transform(doc));
}

export async function getProblemSubmissionDetails(problemSubmissionId) {
  const snapshot = await Firestore()
    .collection(collections.problemSubmissions)
    .doc(problemSubmissionId)
    .get();

  return transform(snapshot);
}

export async function getAllExamResults(developerId) {
  const submissions = await Firestore()
    .collection(collections.examSubmissions)
    .where('developerId', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get();

  // filter out non-overdued submission
  return submissions.docs
    .map((submit) => transform(submit))
    .filter((item) => !item.error);
}

export async function getExamResults(developerId, examId) {
  const snapshot = await Firestore()
    .collection(collections.examSubmissions)
    .where('developerId', '==', developerId)
    .where('examId', '==', examId)
    .orderBy('createdOn', 'desc')
    .get();

  // filter out non-overdued submission
  return snapshot.docs
    .map((submit) => transform(submit))
    .filter((item) => !item.error);
}

export async function createExamSubmission(
  developer,
  { examId, total, correct, results, score, time }
) {
  const { id } = await Firestore().collection(collections.examSubmissions).add({
    examId,
    developerId: developer.id,
    total,
    correct,
    results,
    score,
    time,
    createdOn: Firestore.Timestamp.now(),
  });

  const ref = Firestore().collection(collections.developers).doc(developer.id);

  // update total score
  await ref.update({
    examScore: Firestore.FieldValue.increment(score),
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
    .collection(collections.exams)
    .where('deleted', '==', false)
    .where('companyId', '==', companyId)
    .where('owner', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

/** get all exam submissions for a group */
export async function getExamsubmissionForGroup({ groupId, developerId }) {
  // get all exams which has invited groupId
  const exams = await Firestore()
    .collection(collections.exams)
    .where('invitedGroup', 'array-contains', groupId)
    .get()
    .then((snapshot) => snapshot.docs.map(transform));

  const tasks = exams.map(async (exam) => {
    // get developer's submission for this exam (if exist)
    const snapshot = await Firestore()
      .collection(collections.examSubmissions)
      .where('developerId', '==', developerId)
      .where('examId', '==', exam.id)
      .get();

    // filter out non-overdued submission
    if (snapshot.docs.length) {
      const [submission] = snapshot.docs
        .map(transform)
        .filter((item) => !item.error);
      exam.submission = submission;
    }
  });
  await Promise.all(tasks);
  return exams;
}

/** create an exam observer who keeps track of developer's current time */
export async function createExamObserver({ developerId, examId, duration }) {
  // duration is in second while we store in millisecond
  const { now } = await fetch('/api/time').then((response) => response.json());
  const data = {
    examId,
    developerId,
    startAt: now,
    endAt: now + duration * 1000,
  };

  const { id } = await Firestore()
    .collection(collections.examObserver)
    .add(data);
  data.id = id;
  return data;
}

export async function getExamObserver(observerId) {
  const observer = await Firestore()
    .collection(collections.examObserver)
    .doc(observerId)
    .get();

  return transform(observer);
}

// this does not depend on client's time but use server-side time to calculate submission time
export async function createExamSubmissionV2({
  developerId,
  examId,
  observer,
  total,
  correct,
  results,
  score,
}) {
  if (!developerId) throw new Error(`invalid developerId: ${developerId}`);
  if (!examId) throw new Error(`invalid examId: ${examId}`);
  if (!observer) throw new Error(`invalid observer: ${observer}`);

  const { now } = await fetch('/api/time').then((response) => response.json());
  const { startAt, endAt } = observer;

  // threshold for valid submission in case of slow network
  const margin = 100;

  const valid = startAt - margin <= now && now <= endAt + margin;
  const error = valid ? undefined : 'submission overdued';

  const { id } = await Firestore()
    .collection(collections.examSubmissions)
    .add({
      examId,
      developerId,
      error,
      total,
      correct,
      results,
      score,
      time: Math.round((endAt - now) / 1000),
      createdOn: Firestore.Timestamp.now(),
    });

  const ref = Firestore().collection(collections.developers).doc(developerId);

  // update total score
  if (valid)
    await ref.update({
      examScore: Firestore.FieldValue.increment(score),
    });

  return { id, error };
}

/** get all company and its groups of which developer is a member */
export async function getCompanyAndGroup(developerId) {
  // get develoeprId, companyId, groupId relation
  const list = await Firestore()
    .collection(collections.developerGroups)
    .where('developerId', '==', developerId)
    .orderBy('createdOn', 'desc')
    .get()
    .then((snapshot) => snapshot.docs.map((item) => item.data()));

  // get list of unique companyIds
  const companyIds = [...new Set(list.map((item) => item.companyId))];

  // get list of unique groupIds
  const groupIds = [...new Set(list.map((item) => item.groupIds))];

  // get list of companies
  const companies = await companyIds.map((id) =>
    Firestore().collection(collections.companies).doc(id).get().then(transform)
  );

  companies.forEach((company) => {
    // each company has a group field which contains list of groups,
    // get all groups having this developer as a member
    const { groups } = company;
    company.groups = groups.filter((item) => groupIds.includes(item));
  });
  return companies;
}
