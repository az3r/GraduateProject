import { Firestore } from '@client/firebase';
import { collections } from '@utils/constants';
import { getAttributeReference, transform } from '@utils/firestore';

/** get comany's basic info and its private attributes */
export async function get(companyId) {
  const company = await Firestore()
    .collection(collections.companies)
    .doc(companyId)
    .get();

  if (company.data() === undefined) {
    return undefined;
  }

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
export async function getExams(companyId) {
  const snapshot = await Firestore()
    .collection(collections.exams)
    .where('companyId', '==', companyId)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

/** get all problems basic info without their private attributes */
export async function getProblems(companyId) {
  const snapshot = await Firestore()
    .collection(collections.problems)
    .where('deleted', '==', false)
    .where('companyId', '==', companyId)
    .orderBy('createdOn', 'desc')
    .get();
  return snapshot.docs.map((doc) => transform(doc));
}

/** add an array of developers to group */
export async function addDevelopers(companyId, developerIds) {
  if (developerIds?.length) {
    await getAttributeReference(collections.companies, companyId).update({
      members: Firestore.FieldValue.arrayUnion(...developerIds),
    });

    // add company to each developer
    developerIds.forEach(async (id) => {
      await getAttributeReference(collections.developers, id).update({
        companies: Firestore.FieldValue.arrayUnion(companyId),
      });
    });
  }
}

/** remove developers from group */
export async function removeDevelopers(companyId, developerIds) {
  if (developerIds?.length) {
    await getAttributeReference(collections.companies, companyId).update({
      members: Firestore.FieldValue.arrayRemove(...developerIds),
    });

    // remove company from each developer
    developerIds.forEach(async (id) => {
      await getAttributeReference(collections.developers, id).update({
        companies: Firestore.FieldValue.arrayRemove(companyId),
      });
    });
  }
}

/**
 * return basic info of company's members
 * @param {*} company object retrieved from get function
 */
export async function getMembers(company) {
  if (company?.members?.length) {
    const members = await Firestore()
      .collection(collections.developers)
      .where(Firestore.FieldPath.documentId(), 'in', company.members)
      .get();
    return members.docs.map((item) => transform(item));
  }
  return [];
}

export async function isMember(companyId, developerId) {
  const comapany = await getAttributeReference(
    collections.companies,
    companyId
  ).get();
  const { members } = comapany.data();
  if (members !== undefined) {
    return members.includes(developerId);
  }
  return false;
}

export async function getGroupsDetail(companies) {
  if (companies && companies.length > 0) {
    const result = await Firestore()
      .collection(collections.companies)
      .where(Firestore.FieldPath.documentId(), 'in', companies)
      .get();
    return result.docs.map((item) => transform(item));
  }
  return [];
}

export async function getDeveloperNotInGroup(company) {
  const result = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), 'not-in', company.members)
    .get();

  return result.docs.map((item) => transform(item));
}
