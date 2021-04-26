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
  const { id } = await Firestore()
    .collection(collections.exams)
    .add({
      companyId,
      owner: developerId || companyId,
      title,
      content,
      duration,
      isPrivate,
      score: problems.reduce((a, b) => a.score + b.score),
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
  await Firestore()
    .collection(collections.exams)
    .doc(id)
    .update({
      title,
      content,
      isPrivate,
      duration,
      score: problems.reduce((a, b) => a.score + b.score),
      modifiedAt: Firestore.Timestamp.now(),
    });
  await getAttributeReference(collections.exams, id).update({ problems });
}

/** get exam and its private attributes using either examId or exam itself */
export async function get({ exam = undefined, examId = undefined }) {
  let value;
  if (!exam && !examId) return undefined;
  if (exam) value = exam;
  else {
    // get public fields
    const snapshot = await Firestore()
      .collection(collections.exams)
      .doc(examId)
      .get();
    value = transform(snapshot);
  }

  // get private fields
  const snapshot = await getAttributeReference(
    collections.exams,
    value.id
  ).get();

  const attributes = transform(snapshot);
  // const problemTasks = await attributes.problems.map(async (item) => {
  //   if (item.title) return item;
  //   return await getProblem({ problemId: item.problemId });
  // });

  const problemTasks = [];
  for (let i = 0; i < attributes.problems.length; i += 1) {
    if (attributes.problems[i].title) {
      problemTasks.push(attributes.problems[i]);
    } else {
      const item = await getProblem({
        problemId: attributes.problems[i].problemId,
      });
      problemTasks.push(item);
      // problemTasks.push(getProblem({ problemId: attributes.problems[i].id }));
    }
  }

  return {
    ...value,
    ...attributes,
    problems: problemTasks,
  };
}

/** get all exams' basic info */
export async function getAll(companyId) {
  const exams = await Firestore()
    .collection(collections.exams)
    .where(Firestore.FieldPath.documentId(), '==', companyId)
    .orderBy('createdOn', 'desc')
    .get();
  return exams.docs.map((exam) => transform(exam));
}

export async function getPublishedExams() {
  publishExam;
  const exams = await Firestore()
    .collection(collections.exams)
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
export async function addToInvitation(examId, developerId) {
  await getAttributeReference(collections.exams, examId).update({
    invited: Firestore.FieldValue.arrayUnion(developerId),
  });
}

export async function getInvitedDevelopers(examId) {
  const attributes = await getAttributeReference(
    collections.exams,
    examId
  ).get();

  const developerIds = attributes.get('invited');
  if (developerIds?.length > 0) {
    const developers = await Firestore()
      .collection(collections.developers)
      .where(Firestore.FieldPath.documentId(), 'in', developerIds)
      .get();

    return developers.docs.map((dev) => dev.data());
  }
  return [];
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
