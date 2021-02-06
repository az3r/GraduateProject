export default function test(req, res) {
    if(req.method === "POST")
    {
        console.log(req.body.title, req.body.content, req.body.language, req.body.input, req.body.output);
        res.status(200).json("OK");

    }
} 