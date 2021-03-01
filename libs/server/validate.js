import { Firestore } from './firebase_server';

export default function validate(req) {
  // retrieve user token
  const { authorization } = req.headers;
  const regex = new RegExp(/^(Bearer)\s+(\w+)$$/g);
  const results = regex.exec(authorization);
  const uid = results[2];

  // get user from uid
  return true;
}
