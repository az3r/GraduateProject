import admin from '../../libs/server/firebase_server';

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
    const result = await database.collection('Exams').doc().set(postData);
    return res.status(200).json({
      message: 'Add new test successfully',
      createdOn: result.writeTime,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
