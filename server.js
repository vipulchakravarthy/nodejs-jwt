require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

//make our app to use the request body as json
app.use(express.json());

const posts = [
    {
        username: "vipul",
        title: 'post 1'
    },
    {
        username: "john",
        title: 'post 2'
    }
]

//middleware to authenticate using jwt
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.get('/posts', authenticateToken, (req, res) => {
    console.log(req.user)
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    //authenticate the user

    const username = req.body.username;
    console.log(req.body)
    const user = {
        name: username,
    }
    console.log("before login sign ", user)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)

    res.send({ accessToken: accessToken })
})



app.listen(5000, function () {
    console.log("server listening on port 5000")
})