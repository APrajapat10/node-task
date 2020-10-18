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
};

module.exports = verifyToken;
