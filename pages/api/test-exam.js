
export default async function handler(req, res){
    const baseUrl = 'https://online-code-exercise.herokuapp.com/'
    const apiUrl = baseUrl + (req.body.language == 'python' ? 'py3' : req.body.language.toLowerCase())

    const userId = req.body.userId

    if(!userId)
    {
        res.status(401).json({message: 'Unauthorization - unknow user'})
        return
    }

    //const a = req.body.cases.map(element => element)
               
   // res.status(200).json(a)
   console.log(apiUrl);
   console.log(req.body.code);
   console.log(req.body.cases);

    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + userId
        },
        body: JSON.stringify({
            'code': req.body.code,
            'testcases': req.body.cases
        })
    })

    const message = await response.json()
   
    if(response.status == 401)
        res.status(401).json({'error': 'Unauthorized'})
    else if(response.status == 400)
    {
        res.status(400).json(message)
    }
    else if(response.status != 200)
    {
        res.status(response.status).json({message, comeFrom: 'compiler api'})
    }
    else if(response.status == 200)
            res.status(200).json(message)
    else
        res.status(500).json({'error': 'server error'})
}
