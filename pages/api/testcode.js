export default function test(req, res) {
    if(req.method === "POST")
    {
        console.log(req.body.cases,req.body.code,req.body.language);
        res.status(200).json("OK");

    }
} 