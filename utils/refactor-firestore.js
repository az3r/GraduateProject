/**
 * convert data returned from Firestore query into valid JSON format
 * @param  data
 */
export function transform(document) {
  const data = document.data();
  data.id = document.id;
  if (data.createdOn) data.createdOn = data.createdOn.toMillis();
  if (data.modifiedAt) data.modifiedAt = data.modifiedAt.toMillis();
  return data;
}
