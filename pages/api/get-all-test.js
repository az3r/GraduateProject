import admin from '../../libs/firebase_server'
import createTestModel from '../../model/ExamModel'


const database = admin.firestore()

export default async function getAllTest(req, res)
{
    let testData = []

    const dataRef = await database.collection('Exam').get()
    dataRef.docs.forEach(doc => testData.push({id: doc.id, data: doc.data()}))

    if(testData.length > 0)
        res.status(200).json(testData)
    else
        res.status(500).json({message: 'can not get data from firestore'})

}

