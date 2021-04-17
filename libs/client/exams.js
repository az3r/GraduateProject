import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';
import { Firestore } from './firebase';

export async function create(
  companyId,
  { title, content, duration, password, problems }
) {
  const { id } = await Firestore()
    .collection(collections.exams)
    .add({
      title,
      content,
      password,
      duration,
      score: problems.reduce((a, b) => a.score + b.score),
      problemIds: problems.map((item) => item.id),
      owner: companyId,
      createdOn: Firestore.Timestamp.now(),
    });
  await getAttributeReference(collections.exams, id).set({ id });
  return id;
}

export async function update(
  examId,
  { title, content, password, duration, problems }
) {
  await Firestore()
    .collection(collections.exams)
    .doc(examId)
    .update({
      title,
      content,
      password,
      duration,
      score: problems.reduce((a, b) => a.score + b.score),
      problemIds: problems.map((item) => item.id),
      modifiedAt: Firestore.Timestamp.now(),
    });
}

/** get exam and its private attributes using either examId or exam itself */
export async function get({ exam, examId }) {
  if (exam) {
    const attributes = await getAttributeReference(
      collections.exams,
      exam.id
    ).get();
    return Object.assign(exam, attributes.data());
  }
  if (examId) {
    const snippet = await Firestore()
      .collection(collections.exams)
      .doc(examId)
      .get();
    const attributes = await getAttributeReference(
      collections.exams,
      examId
    ).get();
    return Object.assign(transform(snippet), attributes.data());
  }
  return undefined;
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
    collections.exam,
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
export async function publishExam(examId, startAt, endAt) {
  await Firestore().collection(collections.exams).doc(examId).update({
    published: true,
    startAt,
    endAt,
    modifiedAt: Firestore.Timestamp.now(),
  });
}
