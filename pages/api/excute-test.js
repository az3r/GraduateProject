import admin from '../../libs/firebase_server'
import createHistoryInstance from '../../model/ExamHistoryModel'
import base64 from 'base-64'

const database = admin.firestore()

export default async function handler(req, res){

    const testId = req.body.examId
    const uuid = req.body.userId
    const codeContent = req.body.content

    const baseUrl = 'https://online-code-exercise.herokuapp.com/'

    const examRef = await database.collection('Exam').doc(testId)
    const examData = await (await examRef.get()).data()

    const apiUrl = baseUrl + (examData.language == 'C#' ? 'csharp' : examData.language.toLowerCase())
   

    if(!uuid)
    {
        res.status(401).json({'error': 'Unauthorized'})
        return 
    }
        

    const respone = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : uuid
        },
        body: JSON.stringify({
            'code' : base64.encode(codeContent),
            'input': base64.encode(examData.input),
            'expected' : base64.encode(examData.outputExpect)
        })
    })

    if(respone.status == 401)
        res.status(401).json({'error': 'Unauthorized'})
    else if(respone.status == 400)
        res.status(500).json({error: 'Compile failed'})
    else if(respone.status != 200)
        res.status(respone.status).json({respone, comeFrom: 'compiler api'})
    else if(respone.status == 200)
    {      
        const historyData = createHistoryInstance(uuid, testId, respone.result, codeContent)
        database.collection('History').set(historyData)
        .then(() => {
            res.status(200).json(respone.result)
        }).then((error) => {
            res.status(200).json(respone.result, {message: 'failed to log history to database', error: error})
        })
    }       
    else
        res.status(500).json({'error': 'server error'})
    
}