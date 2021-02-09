
export default async function handler(req, res){
    const baseUrl = 'https://online-code-exercise.herokuapp.com/'
    const apiUrl = baseUrl + (req.body.language === 'Python' ? 'py3' : req.body.language.toLowerCase())

    const userId = req.body.userId

    if(!userId)
    {
        res.status(401).json({message: 'Unauthorization - unknow user'})
        return
    }

    
    const respone = await fetch(apiUrl, {
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
   
    if(respone.status === 401)
        res.status(401).json({'error': 'Unauthorized'})
    else if(respone.status === 400)
    {
        const message = await respone.json()
        res.status(500).json(message)
    }
    else if(respone.status !== 200)
    {
        const message = await respone.json()
        res.status(respone.status).json({message, comeFrom: 'compiler api'})
    }
    else if(respone.status === 200)
    {
        const result = await respone.json()
        res.status(200).json(result)
    }
    else
        res.status(500).json({'error': 'server error'})
}
