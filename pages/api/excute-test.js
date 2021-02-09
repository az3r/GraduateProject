import admin from '../../libs/firebase_server'
import createHistoryInstance from '../../model/ExamHistoryModel'
import base64 from 'base-64'

const database = admin.firestore()

export default async function handler(req, res){

    const testId = req.body.examId
    const uuid = req.body.userId
    const codeContent = req.body.code

    const baseUrl = 'https://online-code-exercise.herokuapp.com/'

    const examRef = await database.collection('Exam').doc(testId)
    const examData = await (await examRef.get()).data()

<<<<<<< HEAD
    const apiUrl = baseUrl + (examData.language == 'python' ? 'py3' : examData.language.toLowerCase())

=======
    const apiUrl = baseUrl + (examData.language === 'Python' ? 'py3' : examData.language.toLowerCase())
   
>>>>>>> origin/api

    if(!uuid)
    {
        res.status(401).json({'error': 'Unauthorized'})
        return
    }


    const respone = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + uuid
        },
        body: JSON.stringify({
            'code' : codeContent,
            'testcases' : examData.cases
        })
    })


    if(respone.status === 401)
        res.status(401).json({'error': 'Unauthorized'})
    else if(respone.status === 400)
    {
        const message = await respone.json()
        res.status(500).json(message)
    }
    else if(respone.status !== 200)
    {
        const result = await respone.json()
        res.status(respone.status).json({message, comeFrom: 'compiler api'})
    }
<<<<<<< HEAD
    else if(respone.status == 200)
    {
        const result = await respone.json()
        const historyData = createHistoryInstance(uuid, testId, result, codeContent)
        database.collection('History').doc().set(historyData)
        .then(() => {
            res.status(200).json(result)
        }).then((error) => {
            res.status(200).json(result, {message: 'failed to log history to database', error: error})
        })
    }
=======
    else if(respone.status === 200)
    {     
        try{
            const result = await respone.json()
            const historyData = createHistoryInstance(uuid, testId, result, codeContent)
            await database.collection('History').doc().set(historyData)

            res.status(200).json(result)         
        }catch( error){
            res.status(200).json(result, {message: 'failed to log history to database', error: error})
            
        }
    }       
>>>>>>> origin/api
    else
        res.status(500).json({'error': 'server error'})

}
