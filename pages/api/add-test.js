import admin from '../../libs/firebase_server'
import createTestModel  from '../../model/ExamModel'

const database = admin.firestore()

export default function handler(req, res){
    
    const postData = createTestModel(req.body.title, req.body.language, req.body.score, req.body.content, req.body.difficulty ,req.body.code, req.body.cases);

    database.collection('Exam').doc().set(postData)
    .then(()=> {
        res.status(200).json({message: 'success'})
    }).then((error) => {
        res.status(400).json(error) 
    })

}

