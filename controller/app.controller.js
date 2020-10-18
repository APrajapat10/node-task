const jwt=require('jsonwebtoken'); 
const config=require('../config.js');
const users = require('../users.js');

const applyPatch=require('fast-json-patch');
const imageThumbnail = require('image-thumbnail');

exports.welcome =(req,res)=>{
    res.json({
        message:'Welcome to the API'
    });
};

exports.login=(req,res)=>{
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
};

exports.jsonPatch=(req,res)=>{
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
};

exports.thumbnailGenerator= (req,res)=>{
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
};

