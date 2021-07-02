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
    .where('deleted', '==', false)
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

export async function getProblemSubmissions(problemId) {
  // get submission
  const submissionSnapshot = await Firestore()
    .collection(collections.problemSubmissions)
    .where('problemId', '==', problemId)
    .get();

  const submissions = submissionSnapshot.docs.map((item) => transform(item));

  // get problems' info
  const problemIds = Array.from(
    new Set(submissions.map((item) => item.problemId))
  );
  const problemSnapshot = await Firestore()
    .collection(collections.problems)
    .where(Firestore.FieldPath.documentId(), 'in', problemIds)
    .get();
  const problems = problemSnapshot.docs.map((item) => transform(item));

  // get developers' info
  const developerIds = Array.from(
    new Set(submissions.map((item) => item.developerId))
  );
  const developerSnapshot = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), 'in', developerIds)
    .get();
  const developers = developerSnapshot.docs.map((item) => transform(item));

  // merge data
  return submissions.map((submission) => {
    const i = developers.findIndex(
      (developer) => submission.developerId === developer.id
    );
    const k = problems.findIndex(
      (problem) => submission.problemId === problem.id
    );
    return { ...submission, ...developers[i], ...problems[k] };
  });
}

export async function getExamSubmissions(examId) {
  // get submission
  const submissionSnapshot = await Firestore()
    .collection(collections.examSubmissions)
    .where('examId', '==', examId)
    .get();

  const submissions = submissionSnapshot.docs.map((item) => transform(item));

  // get exams' info
  const examIds = Array.from(new Set(submissions.map((item) => item.examId)));
  const examSnapshot = await Firestore()
    .collection(collections.problems)
    .where(Firestore.FieldPath.documentId(), 'in', examIds)
    .get();
  const exams = examSnapshot.docs.map((item) => transform(item));

  // get developers' info
  const developerIds = Array.from(
    new Set(submissions.map((item) => item.developerId))
  );
  const developerSnapshot = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), 'in', developerIds)
    .get();
  const developers = developerSnapshot.docs.map((item) => transform(item));

  // merge data
  return submissions.map((submission) => {
    const i = developers.findIndex(
      (developer) => submission.developerId === developer.id
    );
    const k = exams.findIndex((exam) => submission.examId === exam.id);
    return { ...submission, ...developers[i], ...exams[k] };
  });
}

/**
 * create new group in a company
 */
export async function createGroup({ companyId, name }) {
  const company = getAttributeReference(collections.companies, companyId);
  const { id } = await company
    .collection(collections.groups)
    .add({ name, total: 0, companyId });

  await company.update({
    groups: Firestore.FieldValue.arrayUnion({ id, name }),
  });

  return id;
}

/**
 * delete group from company
 */
export async function removeGroup({ companyId, groupId }) {
  const company = getAttributeReference(collections.companies, companyId);
  await company.collection(collections.groups).doc(groupId).delete();

  return true;
}

export async function getGroup({ companyId, groupId }) {
  // get the group
  const company = getAttributeReference(collections.companies, companyId);
  const data = await company.collection(collections.groups).doc(groupId).get();
  const group = transform(data);

  // get members info in this group
  const list = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), 'in', group.members)
    .get();
  group.developers = list.docs.map((item) => transform(item));

  return group;
}

export async function isGroupAvailable({ companyId, name }) {
  const ref = getAttributeReference(collections.companies, companyId);
  const found = await ref
    .collection(collections.groups)
    .where('name', '==', name)
    .get();
  return Boolean(found.empty);
}

/**
 * add developer into group
 */
export async function addMemberIntoGroup({ developerId, companyId, groupId }) {
  // add developer into group
  const group = getAttributeReference(collections.companies, companyId)
    .collection(collections.groups)
    .doc(groupId);
  await group.update({ members: Firestore.FieldValue.arrayUnion(developerId) });

  // increase number of members
  await group.update({ total: Firestore.FieldValue.increment(1) });

  // add group into developer
  await getAttributeReference(collections.developers, developerId).update({
    groups: Firestore.FieldValue.arrayUnion({ companyId, groupId }),
  });
}

/**
 * add developer into group
 */
export async function removeMemberFromGroup({
  developerId,
  companyId,
  groupId,
}) {
  // remove developer from group
  const group = getAttributeReference(collections.companies, companyId)
    .collection(collections.groups)
    .doc(groupId);
  await group.update({
    members: Firestore.FieldValue.arrayRemove(developerId),
  });

  // decrease number of members
  await group.update({ total: Firestore.FieldValue.increment(-1) });

  // remove group from developer
  await getAttributeReference(collections.developers, developerId).update({
    groups: Firestore.FieldValue.arrayRemove({ companyId, groupId }),
  });
}
