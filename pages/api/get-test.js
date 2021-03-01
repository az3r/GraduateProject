import admin from '../../libs/server/firebase_server';

const database = admin.firestore();

export default async function handler(req, res) {
  const examId = req.body.examId;

  if (!examId) {
    res.status(400).json({ message: 'request missing exam id' });
    return;
  }

  const examRef = await database.collection('Exam').doc(examId);
  const examData = await (await examRef.get()).data();

  if (examData) {
    res.status(200).json(examData);
  } else res.status(404).json({ message: 'id not found' });
}
