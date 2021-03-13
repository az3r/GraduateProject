import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { Firestore } from './firebase';

const { problems } = collections;

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
    return transform(snapshot.data());
  }
  const snapshot = await Firestore().collection(problems).get();
  return snapshot.docs.map((item) =>
    transform({ id: item.id, ...item.data() })
  );
}
