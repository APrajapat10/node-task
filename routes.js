const verifyToken = require("./helper");

module.exports = (app) => {
    const routes = require("./controller/app.controller");
  
    // Homepage of API
    app.get("/api", routes.welcome);
  
    /* Public endpoint that accepts an arbitrary username/password pair and returns a signed Json Web Token(JWT)
    which can be used to validate future requests. */
    app.post("/api/login",routes.login);
    
    /* This Protected endpoint accepts an Authorization token, JSON Object and a JSON Patch Object.
    If the token is verified, it applies the JSON patch to the JSON object, and return the resulting json object. */
    app.post("/api/jsonPatch", verifyToken, routes.jsonPatch);

    /* This Protected endpoint accepts an Authorization token and a JSON Object containing the public image url.
    If the token is verified, it downloads the image, resizes it to 50x50 pixels, and returns the resulting thumbnail. */
    app.post("/api/thumbnailGenerator", verifyToken, routes.thumbnailGenerator);

};