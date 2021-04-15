import { Firestore } from '@client/firebase';
import { collections } from '@utils/constants';
import { transform } from '@utils/refactor-firestore';

export async function get(uid) {
  const document = await Firestore()
    .collection(collections.companies)
    .doc(uid)
    .get();
  return transform(document);
}

export async function update(
  uid,
  { introduction, website, industry, headquarter, specialties }
) {
  await Firestore().collection(collections.companies).doc(uid).update({
    introduction,
    website,
    industry,
    headquarter,
    specialties,
  });
}

/** get all problems created by specific company */
export async function getProblems(uid) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('owner', '==', uid)
    .where('deleted', '==', false)
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}
