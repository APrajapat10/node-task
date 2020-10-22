/* eslint-disable no-undef */
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./app');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

describe('Testing GET on /api', () => {
  it('It should return a welcome message', (done) => {
    chai.request(server)
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.equal('Welcome to the API');
        done();
      });
  });
});

describe('Testing POST on /api/login ', () => {
  it('It should return a JWT on the arbitrary username/password provided ', (done) => {
    const user = {
      userName: 'Anurag',
      password: '1234',
    };
    chai.request(server)
      .post('/api/login')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        done();
      });
  });
});

describe('Testing POST on /api/jsonPatch ', () => {
  it('It should accept an authorization token, JSON object, JSON Patching object and return the resulting JSON object', (done) => {
    const jsonBody = {
      jsonObject: {
        id: '01',
        name: 'Shoe',
        price: '500',
      },
      jsonPatch: [{
        op: 'replace', path: '/price', value: '200',
      }],
    };
    chai.request(server)
      .post('/api/jsonPatch')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDIiLCJ1c2VyTmFtZSI6IkFudXJhZyIsInBhc3N3b3JkIjoiMTIzNCJ9LCJpYXQiOjE2MDMxMDc3MjEsImV4cCI6MTYwMzk3MTcyMX0.lJipuKs4SuxdigyzPgnCbCxd9GYAy4a_E-5YXQhgmiI')
      .send(jsonBody)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id').equal('01');
        res.body.should.have.property('name').equal('Shoe');
        res.body.should.have.property('price').equal('200');
        done();
      });
  });
});

describe('Testing POST on /api/thumbnailGenerator ', () => {
  it('It should accept an authorization token and the request body should contain a public image URL. It should download the image, resize to 50x50 pixels, and return the resulting thumbnail.', (done) => {
    const requestBody = {
      image: 'https://wallpapercave.com/wp/wp3990015.jpg',
    };
    chai.request(server)
      .post('/api/thumbnailGenerator')
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDIiLCJ1c2VyTmFtZSI6IkFudXJhZyIsInBhc3N3b3JkIjoiMTIzNCJ9LCJpYXQiOjE2MDMxMDc3MjEsImV4cCI6MTYwMzk3MTcyMX0.lJipuKs4SuxdigyzPgnCbCxd9GYAy4a_E-5YXQhgmiI')
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(200);
        chai.expect(res).to.have.header('content-type', 'image/png');
        done();
      });
  });
});
