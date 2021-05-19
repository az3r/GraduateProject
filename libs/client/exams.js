import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';
import { Firestore } from './firebase';
// eslint-disable-next-line import/no-cycle
import { get as getProblem } from './problems';

/** nếu company tạo exam có thể bỏ field developerId */
export async function create(
  companyId,
  { title, content, duration, isPrivate, problems, developerId }
) {
  // calculate score
  let score = 0;
  problems.forEach((problem) => {
    score += problem.score;
  });
  const { id } = await Firestore()
    .collection(collections.exams)
    .add({
      companyId,
      owner: developerId || companyId,
      title,
      content,
      duration,
      isPrivate,
      score,
      deleted: false,
      createdOn: Firestore.Timestamp.now(),
    });
  await getAttributeReference(collections.exams, id).set({ id, problems });
  return id;
}

/**
 * update an exam, require developerId to be companyId or owner of this exam
 * @param {*} problem exma object
 * @param {*} developerId
 * @param {*} properties exma's properties
 */
export async function update(
  id,
  { title, content, isPrivate, duration, problems }
) {
  // calculate score
  let score = 0;
  problems.forEach((problem) => {
    score += problem.score;
  });
  await Firestore().collection(collections.exams).doc(id).update({
    title,
    content,
    isPrivate,
    duration,
    score,
    modifiedAt: Firestore.Timestamp.now(),
  });
  await getAttributeReference(collections.exams, id).update({ problems });
}

/** get exam and its private attributes using either examId or exam itself */
export async function get({ exam = undefined, examId = undefined }) {
  let value = {};
  if (!exam && !examId) return undefined;
  if (exam) {
    value = exam;
  } else {
    // get public fields
    const snapshot = await Firestore()
      .collection(collections.exams)
      .doc(examId)
      .get();
    value = transform(snapshot);
  }

  // get private fields
  const attr = await getAttributeReference(collections.exams, value.id).get();

  const attributes = transform(attr);

  // const problemTasks = await attributes.problems.map(async (item) => {
  //   if (item.title) return item;
  //   return await getProblem({ problemId: item.problemId });
  // });

  const problemTasks = [];
  if (attributes !== undefined) {
    for (let i = 0; i < attributes.problems.length; i += 1) {
      if (attributes.problems[i].title) {
        problemTasks.push(attributes.problems[i]);
      } else {
        const item = await getProblem({
          problemId: attributes.problems[i].id,
        });
        problemTasks.push(item);
        // problemTasks.push(getProblem({ problemId: attributes.problems[i].id }));
      }
    }
  }

  return {
    ...attributes,
    ...value,
    problems: problemTasks,
  };
}

/** get all exams' basic info */
export async function getAll(companyId) {
  const exams = await Firestore()
    .collection(collections.exams)
    .where(Firestore.FieldPath.documentId(), '==', companyId)
    .where('deleted', '==', false)
    .orderBy('createdOn', 'desc')
    .get();
  return exams.docs.map((exam) => transform(exam));
}

export async function getPublishedExams() {
  const exams = await Firestore()
    .collection(collections.exams)
    .where('deleted', '==', false)
    .where('published', '==', true)
    .orderBy('startAt', 'desc')
    .orderBy('createdOn', 'asc')
    .get();
  return exams.docs.map((exam) => transform(exam));
}

/** get problems' basic info of an exam */
export async function getProblems(exam) {
  if (exam?.problemIds?.length > 0) {
    const snapshot = await Firestore()
      .collection(collections.problems)
      .where(Firestore.FieldPath.documentId(), 'in', exam.problemIds)
      .get();
    return snapshot.docs.map((item) => transform(item));
  }
  return [];
}

export async function addParticipants(examiD, developerIds) {
  if (developerIds?.length > 0)
    await getAttributeReference(collections.exams, examiD).update({
      participants: Firestore.FieldValue.arrayUnion(developerIds),
    });
}

export async function removeParticipants(examiD, developerIds) {
  if (developerIds?.length > 0)
    await getAttributeReference(collections.exams, examiD).update({
      participants: Firestore.FieldValue.arrayRemove(developerIds),
    });
}

export async function getParticipants(examId) {
  const attributes = await getAttributeReference(
    collections.exams,
    examId
  ).get();
  const ids = attributes.get('participants');
  if (ids?.length > 0) {
    const participants = await Firestore()
      .collection(collections.developers)
      .where(Firestore.FieldPath.documentId(), 'in', ids)
      .get();
    return participants.docs.map((item) => item.data());
  }
  return [];
}

/** add developer to invitation list */
export async function addToInvitation(examId, email) {
  await getAttributeReference(collections.exams, examId).update({
    invited: Firestore.FieldValue.arrayUnion(email),
  });
}

export async function getInvitedDevelopers(examId) {
  const attributes = await getAttributeReference(
    collections.exams,
    examId
  ).get();

  return attributes.get('invited') || [];
}

/** remove developers from invigation list, does not remove them from participants list */
export async function removeFromInvitation(examId, developersIds) {
  if (developersIds?.length > 0)
    await getAttributeReference(collections.exams, examId).update({
      invited: Firestore.FieldValue.arrayRemove(developersIds),
    });
}

/**
 * @param {string} examId
 * @param {Date} startAt
 * @param {Date} endAt
 */
export async function publishExam(examId, startAt, endAt, show) {
  await Firestore()
    .collection(collections.exams)
    .doc(examId)
    .update({
      published: show || true,
      startAt,
      endAt,
      modifiedAt: Firestore.Timestamp.now(),
    });
}

export async function getAllExamSubmissions(examId) {
  const result = await Firestore()
    .collection(collections.examSubmissions)
    .where('examId', '==', examId)
    .orderBy('score', 'desc')
    .orderBy('time', 'asc')
    .orderBy('createdOn', 'asc')
    .get();

  if (result.docs.length === 0) {
    return [];
  }

  const examSubmissions = [];
  for (let i = 0; i < result.docs.length; i += 1) {
    const examSubmision = transform(result.docs[i]);
    const document = await Firestore()
      .collection(collections.developers)
      .doc(examSubmision.developerId)
      .get();
    const attributes = transform(document);
    examSubmissions.push(Object.assign(attributes, examSubmision));
  }

  return examSubmissions;
}

export async function remove(id) {
  await Firestore()
    .collection(collections.exams)
    .doc(id)
    .update({ deleted: true });
}
