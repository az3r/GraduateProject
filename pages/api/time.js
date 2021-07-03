import { Firestore } from '@libs/client/firebase';

export default async function handler(req, res) {
  return res.status(200).json({ now: Firestore.Timestamp.now() });
}
