import admin from '../../libs/firebase_server';
import createTestModel from '../../model/ExamModel';

const database = admin.firestore();

export default async function handler(req, res) {
  const postData = createTestModel(
    req.body.title,
    req.body.language,
    req.body.score,
    req.body.content,
    req.body.difficulty,
    req.body.code,
    req.body.cases
  );
  try {
    const result = await database.collection('Exam').doc().set(postData);
    return res.status(200).json({
      message: 'Add new test successfully',
      createdOn: result.writeTime,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
