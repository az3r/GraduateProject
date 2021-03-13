/**
 * convert data returned from Firestore query into valid JSON format
 * @param  data
 */
export function transform(data) {
  const createdOn = data.createdOn && data.createdOn.toMillis();
  const modifiedAt = data.modifiedAt && data.modifiedAt.toMillis();
  return {
    ...data,
    createdOn,
    modifiedAt,
  };
}
