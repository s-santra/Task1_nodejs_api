const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const os = require("os");
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const verifyToken = require("./controller/jwt.js")



const secretKey="secretkey";

const users=[
    {
    id:1,
    username:"supriya",
    email:"ssantra@gmail.com"
},
{
    id:2,
    username:"jfsss",
    email:"xyz@xyz.com  "
}
]

app.post('/login', jsonParser, (req, res) => {
    const { username, email } = req.body;
    console.log(username);
    console.log(email);      
    // Find user by username and email
    const user = users.find(u => u.username == username && u.email == email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
    res.json({ token });
});

app.post("/profile",verifyToken,(req,res)=>{
    jwt.verify(req.token,secretKey,(err,authData)=>{
        if(err){
            res.send({result:"Invalid token"})
        }else{
            res.json({
                message:"profile accessed",
                authData
            })
        }
    })
})


app.get('/stats', (req, res) => {
    res.writeHead('Content-Type','application/json')
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    res.end(JSON.stringify`${freeMemory/1024/1024/1024}`)
    res.end(JSON.stringify`${totalMemory/1024/1024/1024}`)
    // res.send(JSON.stringify(resobj))
});


app.listen(4000,()=>{
    console.log("app is running on port 4000")
})