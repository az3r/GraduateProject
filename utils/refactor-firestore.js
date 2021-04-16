import { Firestore } from '@client/firebase';
import { collections } from '@utils/constants';
/**
 * transform DocumentData returned from Firestore query
 * @returns document.data() with id field, and optional createdOn and modifiedAt
 * @param document
 */
export function transform(document) {
  if (!document) return undefined;
  const data = document.data();
  data.id = document.id;
  if (data.createdOn) data.createdOn = data.createdOn.toMillis();
  if (data.modifiedAt) data.modifiedAt = data.modifiedAt.toMillis();
  return data;
}

export function getAttributeReference(collection, docId) {
  return Firestore()
    .collection(collection)
    .doc(docId)
    .collection(collections.attributes)
    .doc(collections.attributes);
}
