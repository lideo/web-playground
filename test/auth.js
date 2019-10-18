const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const app = require('../app');

const userCredentials = {
  username: 'example@example.com',
  password: 'anotherpass'
}
const badUserCredentials = {
  username: 'example@example.com',
  password: 'sadfasdf'
}

const authenticatedUser = request.agent(app);

before(function(done){
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function(err, response){
      expect(response.status).to.equal(302);
      expect('Location', '/profile');
      done();
    });
});

describe('User authentication', function(done) {

  describe('POST /login', function(done) {

    it('should redirect to /login if the credentials are invalid', function (done) {

      request(app)
        .post('/login')
        .send(badUserCredentials)
        .expect('Location', '/login')
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });

    });

  });

  describe('GET /profile', function(done){
    it('should return a 200 response if the user is logged in', function(done){
      authenticatedUser
        .get('/profile')
        .expect(200, done);
    });

    it('should return a 302 response and redirect to /login if the user is not logged in', function(done){
      request(app).get('/profile')
        .expect('Location', '/login')
        .expect(302, done);
    });

  });

  describe('GET /code/projects', function(done) {
    it('shoud return a 200 response if user is logged in', function(done) {
      authenticatedUser
        .get('/code/projects')
        .expect(200, done);
    });

    it('should return a 302 response and redirect to /login if the user is not logged in', function(done) {
      request(app).get('/code/projects')
        .expect('Location', '/login')
        .expect(302, done);
    })
  });

  describe('GET /code/project/create', function(done) {
    it('shoud return a 200 response if user is logged in', function(done) {
      authenticatedUser.get('/code/project/create')
        .expect(200, done);
    });

    it('should return a 302 response and redirect to /login  if the user is not logged in', function(done) {
      request(app).get('/code/project/create')
        .expect('Location', '/login')
        .expect(302, done);
    })
  });


});