const express=require('express');
const app=express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //Basically tells the system that we want JSON to be used.



const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['app.js'],
};

const specs = swaggerJsdoc(options);
const swaggerUi = require('swagger-ui-express');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
require('./routes')(app);

/**
 * @swagger
 * /api:
 *    get:
 *      description: HomePage of the API.
 */



/**
 * @swagger
 * /api/login:
 *    post:
 *      description: Public endpoint that accepts an arbitrary username/password pair and returns a signed Json Web Token(JWT) which can be used to validate future requests.
 */



/**
 * @swagger
 * /api/jsonPatch:
 *    post:
 *      description: This Protected endpoint accepts an Authorization token, JSON Object and a JSON Patch Object. If the token is verified, it applies the JSON patch to the JSON object, and return the resulting json object.
 */

// app.post('/api/jsonPatch',verifyToken,(req,res)=>{
//     jwt.verify(req.token,config.secretKey,(err,authData)=>{
//         if(err)
//         {
//             res.sendStatus(403);
//         }   
//         else
//         {
//             let jsonObject=req.body.jsonObject;
//             let jsonPatch=req.body.jsonPatch;
//             let modifiedObject = applyPatch.applyPatch(jsonObject,jsonPatch).newDocument;
//             res.send(modifiedObject);
//         }
//     });
// });

/**
 * @swagger
 * /api/thumbnailGenerator:
 *    post:
 *      description: This Protected endpoint accepts an Authorization token and a JSON Object containing the public image url. If the token is verified, it downloads the image, resizes it to 50x50 pixels, and returns the resulting thumbnail.
 *      requestBody:
 *          required: true
 *          content:
 *          application/json:
 *              schema:
 *              type: object
 *              properties:
 *                  username:
 *                  type: string
 *      responses: 
 *          '201':
 *          description: Created
 */



app.listen(5000,()=>console.log('Server started on port 5000'));



module.exports=app;
