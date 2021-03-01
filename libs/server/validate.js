import { FirebaseAuth } from './firebase_server';

export async function verify(authorization) {
  const regex = new RegExp(/^(Bearer)\s+(\w+)$$/g);
  const results = regex.exec(authorization);
  const token = results[2];

  const { uid } = await FirebaseAuth().verifyIdToken(token);
  return uid;
}
