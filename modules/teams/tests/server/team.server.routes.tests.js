'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Team = mongoose.model('Team'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, team;

/**
 * Team routes tests
 */
describe('Team CRUD tests', function () {

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

    // Save a user to the test db and create new Team
    user.save(function () {
      team = {
        name: 'Team name'
      };

      done();
    });
  });

  it('should be able to save a Team if logged in', function (done) {
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

        // Save a new Team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle Team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Get a list of Teams
            agent.get('/api/teams')
              .end(function (teamsGetErr, teamsGetRes) {
                // Handle Team save error
                if (teamsGetErr) {
                  return done(teamsGetErr);
                }

                // Get Teams list
                var teams = teamsGetRes.body;

                // Set assertions
                (teams[0].user._id).should.equal(userId);
                (teams[0].name).should.match('Team name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Team if not logged in', function (done) {
    agent.post('/api/teams')
      .send(team)
      .expect(403)
      .end(function (teamSaveErr, teamSaveRes) {
        // Call the assertion callback
        done(teamSaveErr);
      });
  });

  it('should not be able to save an Team if no name is provided', function (done) {
    // Invalidate name field
    team.name = '';

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

        // Save a new Team
        agent.post('/api/teams')
          .send(team)
          .expect(400)
          .end(function (teamSaveErr, teamSaveRes) {
            // Set message assertion
            (teamSaveRes.body.message).should.match('Please fill Team name');

            // Handle Team save error
            done(teamSaveErr);
          });
      });
  });

  it('should be able to update an Team if signed in', function (done) {
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

        // Save a new Team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle Team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Update Team name
            team.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Team
            agent.put('/api/teams/' + teamSaveRes.body._id)
              .send(team)
              .expect(200)
              .end(function (teamUpdateErr, teamUpdateRes) {
                // Handle Team update error
                if (teamUpdateErr) {
                  return done(teamUpdateErr);
                }

                // Set assertions
                (teamUpdateRes.body._id).should.equal(teamSaveRes.body._id);
                (teamUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Teams if not signed in', function (done) {
    // Create new Team model instance
    var teamObj = new Team(team);

    // Save the team
    teamObj.save(function () {
      // Request Teams
      request(app).get('/api/teams')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Team if not signed in', function (done) {
    // Create new Team model instance
    var teamObj = new Team(team);

    // Save the Team
    teamObj.save(function () {
      request(app).get('/api/teams/' + teamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', team.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Team with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/teams/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Team is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Team which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Team
    request(app).get('/api/teams/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Team with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Team if signed in', function (done) {
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

        // Save a new Team
        agent.post('/api/teams')
          .send(team)
          .expect(200)
          .end(function (teamSaveErr, teamSaveRes) {
            // Handle Team save error
            if (teamSaveErr) {
              return done(teamSaveErr);
            }

            // Delete an existing Team
            agent.delete('/api/teams/' + teamSaveRes.body._id)
              .send(team)
              .expect(200)
              .end(function (teamDeleteErr, teamDeleteRes) {
                // Handle team error error
                if (teamDeleteErr) {
                  return done(teamDeleteErr);
                }

                // Set assertions
                (teamDeleteRes.body._id).should.equal(teamSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Team if not signed in', function (done) {
    // Set Team user
    team.user = user;

    // Create new Team model instance
    var teamObj = new Team(team);

    // Save the Team
    teamObj.save(function () {
      // Try deleting Team
      request(app).delete('/api/teams/' + teamObj._id)
        .expect(403)
        .end(function (teamDeleteErr, teamDeleteRes) {
          // Set message assertion
          (teamDeleteRes.body.message).should.match('User is not authorized');

          // Handle Team error error
          done(teamDeleteErr);
        });

    });
  });

  it('should be able to get a single Team that has an orphaned user reference', function (done) {
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

          // Save a new Team
          agent.post('/api/teams')
            .send(team)
            .expect(200)
            .end(function (teamSaveErr, teamSaveRes) {
              // Handle Team save error
              if (teamSaveErr) {
                return done(teamSaveErr);
              }

              // Set assertions on new Team
              (teamSaveRes.body.name).should.equal(team.name);
              should.exist(teamSaveRes.body.user);
              should.equal(teamSaveRes.body.user._id, orphanId);

              // force the Team to have an orphaned user reference
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

                    // Get the Team
                    agent.get('/api/teams/' + teamSaveRes.body._id)
                      .expect(200)
                      .end(function (teamInfoErr, teamInfoRes) {
                        // Handle Team error
                        if (teamInfoErr) {
                          return done(teamInfoErr);
                        }

                        // Set assertions
                        (teamInfoRes.body._id).should.equal(teamSaveRes.body._id);
                        (teamInfoRes.body.name).should.equal(team.name);
                        should.equal(teamInfoRes.body.user, undefined);

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
      Team.remove().exec(done);
    });
  });
});
