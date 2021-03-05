/**
 * convert data returned from Firestore query into valid JSON format
 * @param  data
 */
export function transform(data) {
  return data.createdOn
    ? {
        ...data,
        createdOn: data.createdOn.toMillis(),
      }
    : data;
}
