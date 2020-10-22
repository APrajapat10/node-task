# Node.js Task (HackerBay)

A simple stateless microservice in Node.js, with three major functionalities -

Authentication, JSON patching and Image Thumbnail Generation.

## Prerequisites

You need to install the following dependencies in the project location:

* body-parser
* chai-http
* express
* fast-json-patch
* image-thumbnail
* jsonwebtoken
* morgan
* nodemon
* sharp

Dev-dependencies:
* chai
* eslint
* eslint-config-airbnb-base
* eslint-plugin-import
* mocha
* nyc
* jsdoc

## Installation

* Using package manager, install [Node.js](https://pip.pypa.io/en/stable/).

* Navigate to the project location.

* Use [npm](https://www.npmjs.com/) to install all dependencies and dev-dependencies respectively:

```bash
npm install
```

```bash
npm install --save-dev [package name]
```

## Usage

* Docker Pull Command: docker pull aprajapat10/nodeauthapi-image

* Run the test suite for this microservice with:

```bash
npm test
```

* To generate code test coverage reports:

```bash
npm run coverage
```

* To see the API Documentation using JSDoc, run the command below and open global.html in the 'out' folder:

```bash
./node_modules/.bin/jsdoc ./controller/app.controller.js
```

* The linting npm script to automatically fix problems is:

```bash
npm lint:fix
```

* To start the server, run:

```bash
npm start
```

The server starts on port: **5000**.

It supports 4 kinds of API calls:

1. ### GET: http://localhost:5000/api 
It returns a welcome message in JSON format in the response body with status 200:

    "message": "Welcome to the API"

2. ### POST: http://localhost:5000/api/login
It accepts username & password in JSON format in the request body as:

    "userName":"<userName>",
    "password":"<password>"

and returns a JWT in the response body with status 200 (if it's correct) in the format:

"token": "<JWT>"

**Note** : Valid dummy username & passwords are present in users.js

3. ### POST: http://localhost:5000/api/jsonPatch

It accepts a JWT in the header (Authorization) in the format: 
Bearer <JWT> with a JSON Object and a JSON Patch object in the request body in the following format:

    "jsonObject":{
    },
    "jsonPatch":[{
        "op":"<op>","path":"/<path>","value":"<value>"
    }]

Eg:

    "jsonObject":{
        "id":"01",
        "name":"Shoe",
        "price":"500"
    },
    "jsonPatch":[{
        "op":"replace","path":"/price","value":"200"
    },
    { "op":"add","path":"/style","value":"western"}]

If the JWT is verified, it returns the resulting JSON object after applying the patch.
Eg:

    "id": "01",
    "name": "Shoe",
    "price": "200",
    "style": "western"



4. ### POST: http://localhost:5000/api/thumbnailGenerator


It accepts a JWT in the header (Authorization) in the format:

Bearer <JWT> with a JSON object in the request body in the format:

    "image":"<Image Link>"

Eg:

    "image":"https://wallpapercave.com/wp/wp3990015.jpg"

and returns the resulting thumbnail resized to 50x50 pixels.

## Features

* Dockerized.
* Integrated a centralized app for logging/monitoring purposes (Morgan).
* Istanbul has been used to generate code test coverage reports.
* JSDoc API Documentation.


  
