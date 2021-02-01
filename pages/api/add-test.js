import admin from '../../libs/firebase_server'
import createTestModel  from '../../model/ExamModel'

const database = admin.firestore()

export default function handler(req, res){
    
    const postData = createTestModel(req.body.title, req.body.language, req.body.input, req.body.output, req.body.content);

    database.collection('Exam').doc().set(postData)
    .then(()=> {
        res.status(200).json({notify: 'add database success'})
    }).then((error) => {
        res.status(400).json(error)
    })

}

