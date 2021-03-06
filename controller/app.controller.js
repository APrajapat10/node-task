const jwt = require('jsonwebtoken');
const applyPatch = require('fast-json-patch');
const imageThumbnail = require('image-thumbnail');
const config = require('../config.js');
const users = require('../users.js');

/**
 * This is a method that displays welcome message.
 * @return {string} Welcome to the API
 */

exports.welcome = (req, res) => {
  res.json({
    message: 'Welcome to the API',
  });
};

/**
 * This is a function that accepts a username/password pair and returns a signed JWT
 * which can be used to validate future requests.
 * @param req {Object} The request.
 * @param req.body.userName {String} The username.
 * @param req.body.password {String} The Password.
 * @param req.body {Object} The JSON payload.
 * @return res {Object} The response containing JWT.
 */

exports.login = (req, res) => {
  if (!req.is('application/json')) {
    res.status(422).send({
      errorMsg: 'Unprocessable entity',
    });
  } else if ('userName' in req.body && 'password' in req.body) {
    const user = users.find(
      (el) => (el.userName === req.body.userName && el.password === req.body.password),
    );
    if (user === undefined) {
      res.status(404).send({
        errorMsg: 'User not found.',
      });
    } else {
      jwt.sign({ user }, config.secretKey, { expiresIn: config.expiresIn }, (err, token) => {
        res.json({
          token,
        });
      });
    }
  } else {
    res.status(400).send({
      errorMsg: 'Invalid input type',
    });
  }
};

/**
 * This is a function that accepts accepts Authorization token, JSON Object and a JSON Patch Object.
 * If verified, it applies the JSON patch to the JSON object, and return the resulting JSON object.
 * @param req {Object} The request.
 * @param req.body.jsonObject {String} The jsonObject.
 * @param req.body.jsonPatch {String} The jsonPatch.
 * @param req.body {Object} The JSON payload.
 * @return res {Object} The resulting JSON object.
 */

exports.jsonPatch = (req, res) => {
  jwt.verify(req.token, config.secretKey, (err) => {
    if (err) {
      res.sendStatus(403);
    } else if (!req.is('application/json')) {
      res.status(422).send({
        errorMsg: 'Unprocessable entity',
      });
    } else if ('jsonObject' in req.body && 'jsonPatch' in req.body) {
      try {
        const { jsonObject } = req.body;
        const { jsonPatch } = req.body;
        const modifiedObject = applyPatch.applyPatch(jsonObject, jsonPatch).newDocument;
        res.send(modifiedObject);
      } catch (error) {
        res.status(422).send({
          errorMsg: 'Invalid JSON formats',
        });
      }
    } else {
      res.status(400).send({
        errorMsg: 'Invalid input type',
      });
    }
  });
};

/**
 * This is a function that accepts accepts JWT token and a JSON Object containing the image url.
 * If verified, it resizes it to 50x50 pixels, and returns the resulting thumbnail.
 * @param req {Object} The request.
 * @param req.body.image {String} The image url.
 * @param req.body {Object} The JSON payload.
 * @return {Image/png} The image thumbnail resized to 50x50 pixels.
 */

exports.thumbnailGenerator = (req, res) => {
  jwt.verify(req.token, config.secretKey, async (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const img = req.body.image;
        const options = { width: 50, height: 50, responseType: '' };
        const thumbnail = await imageThumbnail({ uri: img }, options);
        const thumbImage = Buffer.from(thumbnail, 'base64');

        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': thumbImage.length,
        });
        res.end(thumbImage);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  });
};
