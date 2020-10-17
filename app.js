const express=require('express');
const jwt=require('jsonwebtoken');
const bodyParser = require('body-parser');

const app=express();

app.use(bodyParser.json()); //Basically tells the system that we want JSON to be used.

const config=require('./config.js');
const users = require('./users.js');

const applyPatch=require('fast-json-patch');

const imageThumbnail = require('image-thumbnail');

app.get('/api',(req,res)=>{
    res.json({
        message:'Welcome to the API'
    })
});

app.post('/api/jsonPatch',verifyToken,(req,res)=>{
    jwt.verify(req.token,config.secretKey,(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            let jsonObject=req.body.jsonObject;
            let jsonPatch=req.body.jsonPatch;
            let modifiedObject = applyPatch.applyPatch(jsonObject,jsonPatch).newDocument;
            res.send(modifiedObject);
        }
    });
});

app.post('/api/thumbnailGenerator',verifyToken,(req,res)=>{
    jwt.verify(req.token,config.secretKey,async(err,authData)=>{
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            let img=req.body.image;
            let options = { width: 50, height: 50, responseType: ''}
            try {
                const thumbnail = await imageThumbnail({uri:img}, options);
                let thumbImage = Buffer.from(thumbnail, 'base64');

                res.writeHead(200,{
                    'Content-Type': 'image/png',
                    'Content-Length': thumbImage.length
                  });
                  res.end(thumbImage); 
            } catch (err) {
                console.error(err);
            }
        }
    });
});

app.post('/api/login',(req,res)=>{

    //Verifying Username and Password
    let user = users.find(user=> (user.userName === req.body.userName && user.password===req.body.password));
    if(user === undefined){         
        res.status(404).send({
            errorMsg: "User not found."
        })
    }else{
        jwt.sign({user},config.secretKey,{expiresIn:config.expiresIn},(err,token)=>{
            res.json({
                token
            });
        });
    }
    
});

app.listen(5000,()=>console.log('Server started on port 5000'));

//Verifying Token
function verifyToken(req,res,next){
    //Getting the auth header value
    const bearerHeader=req.headers['authorization'];

    //Checking if bearer is undefined
    if(typeof bearerHeader!==undefined)
    {
        //Splitting at space
        const bearer=bearerHeader.split(' ');
        //Getting token from array
        const bearerToken=bearer[1];
        //Setting the token
        req.token=bearerToken;
        //Next middleware
        next();
    }
    else
    {
        //Forbidden
        res.sendStatus(403);
    }
}


