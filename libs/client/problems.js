import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const { problems, users } = collections;

export async function create(userId, props) {
  const { id } = await Firestore()
    .collection(problems)
    .add({
      owner: userId,
      createdOn: Firestore.Timestamp.now(),
      ...props,
    });
  return id;
}

export async function get(problemId) {
  if (problemId) {
    const snapshot = await Firestore()
      .collection(problems)
      .doc(problemId)
      .get();
    if (snapshot.data()) {
      return transform({ id: snapshot.id, ...snapshot.data() });
    }
    return null;
  }
  const snapshot = await Firestore()
    .collection(problems)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}

export async function update(problemId, props) {
  await Firestore()
    .collection(problems)
    .doc(problemId)
    .update({
      ...props,
      modifiedAt: Firestore.Timestamp.now(),
    });
  return true;
}

export async function getParticipants(problemId) {
  const problem = await Firestore().collection(problems).doc(problemId).get();
  const ids = problem.get('participants');
  if (ids === undefined || ids.length === 0) {
    return [];
  }
  const participants = await Firestore()
    .collection(users)
    .where(Firestore.FieldPath.documentId(), 'in', ids)
    .get();
  return participants.docs.map((item) => item.data());
}
