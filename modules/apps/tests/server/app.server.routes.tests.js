'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  App = mongoose.model('App'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, app;

/**
 * App routes tests
 */
describe('App CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new App
    user.save(function () {
      app = {
        name: 'App name'
      };

      done();
    });
  });

  it('should be able to save a App if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new App
        agent.post('/api/apps')
          .send(app)
          .expect(200)
          .end(function (appSaveErr, appSaveRes) {
            // Handle App save error
            if (appSaveErr) {
              return done(appSaveErr);
            }

            // Get a list of Apps
            agent.get('/api/apps')
              .end(function (appsGetErr, appsGetRes) {
                // Handle App save error
                if (appsGetErr) {
                  return done(appsGetErr);
                }

                // Get Apps list
                var apps = appsGetRes.body;

                // Set assertions
                (apps[0].user._id).should.equal(userId);
                (apps[0].name).should.match('App name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an App if not logged in', function (done) {
    agent.post('/api/apps')
      .send(app)
      .expect(403)
      .end(function (appSaveErr, appSaveRes) {
        // Call the assertion callback
        done(appSaveErr);
      });
  });

  it('should not be able to save an App if no name is provided', function (done) {
    // Invalidate name field
    app.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new App
        agent.post('/api/apps')
          .send(app)
          .expect(400)
          .end(function (appSaveErr, appSaveRes) {
            // Set message assertion
            (appSaveRes.body.message).should.match('Please fill App name');

            // Handle App save error
            done(appSaveErr);
          });
      });
  });

  it('should be able to update an App if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new App
        agent.post('/api/apps')
          .send(app)
          .expect(200)
          .end(function (appSaveErr, appSaveRes) {
            // Handle App save error
            if (appSaveErr) {
              return done(appSaveErr);
            }

            // Update App name
            app.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing App
            agent.put('/api/apps/' + appSaveRes.body._id)
              .send(app)
              .expect(200)
              .end(function (appUpdateErr, appUpdateRes) {
                // Handle App update error
                if (appUpdateErr) {
                  return done(appUpdateErr);
                }

                // Set assertions
                (appUpdateRes.body._id).should.equal(appSaveRes.body._id);
                (appUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Apps if not signed in', function (done) {
    // Create new App model instance
    var appObj = new App(app);

    // Save the app
    appObj.save(function () {
      // Request Apps
      request(app).get('/api/apps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single App if not signed in', function (done) {
    // Create new App model instance
    var appObj = new App(app);

    // Save the App
    appObj.save(function () {
      request(app).get('/api/apps/' + appObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', app.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single App with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/apps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'App is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single App which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent App
    request(app).get('/api/apps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No App with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an App if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new App
        agent.post('/api/apps')
          .send(app)
          .expect(200)
          .end(function (appSaveErr, appSaveRes) {
            // Handle App save error
            if (appSaveErr) {
              return done(appSaveErr);
            }

            // Delete an existing App
            agent.delete('/api/apps/' + appSaveRes.body._id)
              .send(app)
              .expect(200)
              .end(function (appDeleteErr, appDeleteRes) {
                // Handle app error error
                if (appDeleteErr) {
                  return done(appDeleteErr);
                }

                // Set assertions
                (appDeleteRes.body._id).should.equal(appSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an App if not signed in', function (done) {
    // Set App user
    app.user = user;

    // Create new App model instance
    var appObj = new App(app);

    // Save the App
    appObj.save(function () {
      // Try deleting App
      request(app).delete('/api/apps/' + appObj._id)
        .expect(403)
        .end(function (appDeleteErr, appDeleteRes) {
          // Set message assertion
          (appDeleteRes.body.message).should.match('User is not authorized');

          // Handle App error error
          done(appDeleteErr);
        });

    });
  });

  it('should be able to get a single App that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new App
          agent.post('/api/apps')
            .send(app)
            .expect(200)
            .end(function (appSaveErr, appSaveRes) {
              // Handle App save error
              if (appSaveErr) {
                return done(appSaveErr);
              }

              // Set assertions on new App
              (appSaveRes.body.name).should.equal(app.name);
              should.exist(appSaveRes.body.user);
              should.equal(appSaveRes.body.user._id, orphanId);

              // force the App to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the App
                    agent.get('/api/apps/' + appSaveRes.body._id)
                      .expect(200)
                      .end(function (appInfoErr, appInfoRes) {
                        // Handle App error
                        if (appInfoErr) {
                          return done(appInfoErr);
                        }

                        // Set assertions
                        (appInfoRes.body._id).should.equal(appSaveRes.body._id);
                        (appInfoRes.body.name).should.equal(app.name);
                        should.equal(appInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      App.remove().exec(done);
    });
  });
});
