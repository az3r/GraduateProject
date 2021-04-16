import { Firestore } from '@client/firebase';
import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/refactor-firestore';

/** get comany's basic info and its private attributes */
export async function get(companyId) {
  const company = await Firestore()
    .collection(collections.companies)
    .doc(companyId)
    .get();
  const attributes = await getAttributeReference(
    collections.companies,
    companyId
  ).get();
  return transform(company, attributes);
}

/** get all companies' basic info */
export async function getAll() {
  const companies = await Firestore().collection(collections.companies).get();
  return companies.docs.map((company) => transform(company));
}

export async function update(
  companyId,
  { introduction, website, industry, headquarter, specialties }
) {
  await getAttributeReference(collections.companies, companyId).update({
    introduction,
    website,
    industry,
    headquarter,
    specialties,
  });
}

/** get all problems basic info without their private attributes */
export async function getProblems(companyId) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('owner', '==', companyId)
    .where('deleted', '==', false)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}
