import admin from '../../libs/firebase_server';
import createHistoryInstance from '../../model/ExamHistoryModel';
import base64 from 'base-64';

const database = admin.firestore();

export default async function handler(req, res) {
  const testId = req.body.examId;
  const uuid = req.body.userId;
  const codeContent = req.body.code;

  const baseUrl = 'https://online-code-exercise.herokuapp.com/';

  const examRef = await database.collection('Exam').doc(testId);
  const examData = await (await examRef.get()).data();

  const apiUrl =
    baseUrl +
    (examData.language === 'Python' ? 'py3' : examData.language.toLowerCase());

  if (!uuid) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const respone = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + uuid,
    },
    body: JSON.stringify({
      code: codeContent,
      testcases: examData.cases,
    }),
  });

  if (respone.status === 401) res.status(401).json({ error: 'Unauthorized' });
  else if (respone.status === 400) {
    const message = await respone.json();
    res.status(500).json(message);
  } else if (respone.status !== 200) {
    const result = await respone.json();
    res.status(respone.status).json({ result, comeFrom: 'compiler api' });
  } else if (respone.status === 200) {
    try {
      const result = await respone.json();
      const historyData = createHistoryInstance(
        uuid,
        testId,
        result,
        codeContent
      );
      await database.collection('History').doc().set(historyData);

      res.status(200).json(result);
    } catch (error) {
      res
        .status(200)
        .json(result, {
          message: 'failed to log history to database',
          error: error,
        });
    }
  } else res.status(500).json({ error: 'server error' });
}
