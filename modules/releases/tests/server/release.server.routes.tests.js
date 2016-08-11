'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Release = mongoose.model('Release'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, release;

/**
 * Release routes tests
 */
describe('Release CRUD tests', function () {

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

    // Save a user to the test db and create new Release
    user.save(function () {
      release = {
        name: 'Release name'
      };

      done();
    });
  });

  it('should be able to save a Release if logged in', function (done) {
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

        // Save a new Release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle Release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Get a list of Releases
            agent.get('/api/releases')
              .end(function (releasesGetErr, releasesGetRes) {
                // Handle Release save error
                if (releasesGetErr) {
                  return done(releasesGetErr);
                }

                // Get Releases list
                var releases = releasesGetRes.body;

                // Set assertions
                (releases[0].user._id).should.equal(userId);
                (releases[0].name).should.match('Release name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Release if not logged in', function (done) {
    agent.post('/api/releases')
      .send(release)
      .expect(403)
      .end(function (releaseSaveErr, releaseSaveRes) {
        // Call the assertion callback
        done(releaseSaveErr);
      });
  });

  it('should not be able to save an Release if no name is provided', function (done) {
    // Invalidate name field
    release.name = '';

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

        // Save a new Release
        agent.post('/api/releases')
          .send(release)
          .expect(400)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Set message assertion
            (releaseSaveRes.body.message).should.match('Please fill Release name');

            // Handle Release save error
            done(releaseSaveErr);
          });
      });
  });

  it('should be able to update an Release if signed in', function (done) {
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

        // Save a new Release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle Release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Update Release name
            release.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Release
            agent.put('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseUpdateErr, releaseUpdateRes) {
                // Handle Release update error
                if (releaseUpdateErr) {
                  return done(releaseUpdateErr);
                }

                // Set assertions
                (releaseUpdateRes.body._id).should.equal(releaseSaveRes.body._id);
                (releaseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Releases if not signed in', function (done) {
    // Create new Release model instance
    var releaseObj = new Release(release);

    // Save the release
    releaseObj.save(function () {
      // Request Releases
      request(app).get('/api/releases')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Release if not signed in', function (done) {
    // Create new Release model instance
    var releaseObj = new Release(release);

    // Save the Release
    releaseObj.save(function () {
      request(app).get('/api/releases/' + releaseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', release.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Release with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/releases/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Release is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Release which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Release
    request(app).get('/api/releases/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Release with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Release if signed in', function (done) {
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

        // Save a new Release
        agent.post('/api/releases')
          .send(release)
          .expect(200)
          .end(function (releaseSaveErr, releaseSaveRes) {
            // Handle Release save error
            if (releaseSaveErr) {
              return done(releaseSaveErr);
            }

            // Delete an existing Release
            agent.delete('/api/releases/' + releaseSaveRes.body._id)
              .send(release)
              .expect(200)
              .end(function (releaseDeleteErr, releaseDeleteRes) {
                // Handle release error error
                if (releaseDeleteErr) {
                  return done(releaseDeleteErr);
                }

                // Set assertions
                (releaseDeleteRes.body._id).should.equal(releaseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Release if not signed in', function (done) {
    // Set Release user
    release.user = user;

    // Create new Release model instance
    var releaseObj = new Release(release);

    // Save the Release
    releaseObj.save(function () {
      // Try deleting Release
      request(app).delete('/api/releases/' + releaseObj._id)
        .expect(403)
        .end(function (releaseDeleteErr, releaseDeleteRes) {
          // Set message assertion
          (releaseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Release error error
          done(releaseDeleteErr);
        });

    });
  });

  it('should be able to get a single Release that has an orphaned user reference', function (done) {
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

          // Save a new Release
          agent.post('/api/releases')
            .send(release)
            .expect(200)
            .end(function (releaseSaveErr, releaseSaveRes) {
              // Handle Release save error
              if (releaseSaveErr) {
                return done(releaseSaveErr);
              }

              // Set assertions on new Release
              (releaseSaveRes.body.name).should.equal(release.name);
              should.exist(releaseSaveRes.body.user);
              should.equal(releaseSaveRes.body.user._id, orphanId);

              // force the Release to have an orphaned user reference
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

                    // Get the Release
                    agent.get('/api/releases/' + releaseSaveRes.body._id)
                      .expect(200)
                      .end(function (releaseInfoErr, releaseInfoRes) {
                        // Handle Release error
                        if (releaseInfoErr) {
                          return done(releaseInfoErr);
                        }

                        // Set assertions
                        (releaseInfoRes.body._id).should.equal(releaseSaveRes.body._id);
                        (releaseInfoRes.body.name).should.equal(release.name);
                        should.equal(releaseInfoRes.body.user, undefined);

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
      Release.remove().exec(done);
    });
  });
});
