import { collections } from '@utils/constants';
import { transform } from '@utils/firestore';
import { FirebaseAuth, Firestore, Storage } from './firebase';

export async function find(uid) {
  if (!uid) return undefined;

  // search in Developers then Companies collection
  let results = await Firestore()
    .collection(collections.developers)
    .where(Firestore.FieldPath.documentId(), '==', uid)
    .limit(1)
    .get();
  if (results.size > 0) return transform(results.docs[0]);

  results = await Firestore()
    .collection(collections.companies)
    .where(Firestore.FieldPath.documentId(), '==', uid)
    .limit(1)
    .get();
  if (results.size > 0) return transform(results.docs[0]);

  return undefined;
}

/**
 * update user's name
 * @param {*} user object returned fron useAuth()
 * @param {*} role developer or company
 * @param {*} displayName new name
 */
export async function updateName(user, role, displayName) {
  const collection =
    role === 'developer' ? collections.developers : collections.companies;

  await user.updateProfile({ displayName });

  // sync in firestore
  await Firestore()
    .collection(collection)
    .doc(user.uid)
    .update({ name: displayName });
}

/**
 * update user's avatar
 * @param {*} user object returned fron useAuth()
 * @param {*} role developer or company
 * @param {*} file image file
 */
export async function updateAvatar(user, role, file) {
  const collection =
    role === 'developer' ? collections.developers : collections.companies;

  // upload to storage
  const ref = Storage().ref(`avatars/${user.uid}`);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  // update avatar using upload url
  await user.updateProfile({ photoURL: url });

  // sync in firestore
  await Firestore()
    .collection(collection)
    .doc(user.uid)
    .update({ avatar: url });

  return url;
}

/**
 * send a password reset email and redirect user back to app
 * @param {string} email email to send
 * @param {string} redirect redirect url to your app
 */
export async function sendPasswordResetEmail(email, redirect) {
  await FirebaseAuth().sendPasswordResetEmail(email, { url: redirect });
}

/**
 * send an update email verification to the new email
 * @note redirected page should call updateEmail function below
 * @param {*} user object returned fron useAuth()
 * @param {string} callback redirect url when user click on verification link
 * @param {*} email new email to update
 */
export async function sendUpdateEmailVerification(user, callback, email) {
  await user.verifyBeforeUpdateEmail(email, {
    url: callback,
  });
}

/**
 * sync new email in FirebaseAuth with Firestore
 * @param {*} user returned object from useAuth()
 * @param {string} role either developer or company
 * @param {string} email new email
 */
export async function syncEmail(user, role, email) {
  const collection =
    role === 'developer' ? collections.developers : collections.companies;

  // sync in firestore
  await Firestore().collection(collection).doc(user.uid).update({ email });
}
