import { Firestore } from '@client/firebase';
import { collections } from '@utils/constants';
/**
 * transform DocumentData returned from Firestore query
 * @returns document.data() with id field, and optional createdOn and modifiedAt
 * @param document firestore DocumentData
 * @param attributes document reference to document's private attributes
 */
export function transform(document, attributes) {
  if (!document) return undefined;
  const data = document.data();
  data.id = document.id;
  if (data.createdOn) data.createdOn = data.createdOn.toMillis();
  if (data.modifiedAt) data.modifiedAt = data.modifiedAt.toMillis();
  if (attributes?.exists) Object.assign(data, attributes.data());
  return data;
}

/**
 * retrieve a document's private attribute
 * @param {*} collection the name of collection
 * @param {*} docId document's id
 * @returns document's private attributes
 */
export function getAttributeReference(collection, docId) {
  return Firestore()
    .collection(collection)
    .doc(docId)
    .collection(collections.attributes)
    .doc(collections.attributes);
}
