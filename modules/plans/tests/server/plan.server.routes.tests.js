'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plan = mongoose.model('Plan'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, plan;

/**
 * Plan routes tests
 */
describe('Plan CRUD tests', function () {

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

    // Save a user to the test db and create new Plan
    user.save(function () {
      plan = {
        name: 'Plan name'
      };

      done();
    });
  });

  it('should be able to save a Plan if logged in', function (done) {
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

        // Save a new Plan
        agent.post('/api/plans')
          .send(plan)
          .expect(200)
          .end(function (planSaveErr, planSaveRes) {
            // Handle Plan save error
            if (planSaveErr) {
              return done(planSaveErr);
            }

            // Get a list of Plans
            agent.get('/api/plans')
              .end(function (plansGetErr, plansGetRes) {
                // Handle Plan save error
                if (plansGetErr) {
                  return done(plansGetErr);
                }

                // Get Plans list
                var plans = plansGetRes.body;

                // Set assertions
                (plans[0].user._id).should.equal(userId);
                (plans[0].name).should.match('Plan name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Plan if not logged in', function (done) {
    agent.post('/api/plans')
      .send(plan)
      .expect(403)
      .end(function (planSaveErr, planSaveRes) {
        // Call the assertion callback
        done(planSaveErr);
      });
  });

  it('should not be able to save an Plan if no name is provided', function (done) {
    // Invalidate name field
    plan.name = '';

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

        // Save a new Plan
        agent.post('/api/plans')
          .send(plan)
          .expect(400)
          .end(function (planSaveErr, planSaveRes) {
            // Set message assertion
            (planSaveRes.body.message).should.match('Please fill Plan name');

            // Handle Plan save error
            done(planSaveErr);
          });
      });
  });

  it('should be able to update an Plan if signed in', function (done) {
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

        // Save a new Plan
        agent.post('/api/plans')
          .send(plan)
          .expect(200)
          .end(function (planSaveErr, planSaveRes) {
            // Handle Plan save error
            if (planSaveErr) {
              return done(planSaveErr);
            }

            // Update Plan name
            plan.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Plan
            agent.put('/api/plans/' + planSaveRes.body._id)
              .send(plan)
              .expect(200)
              .end(function (planUpdateErr, planUpdateRes) {
                // Handle Plan update error
                if (planUpdateErr) {
                  return done(planUpdateErr);
                }

                // Set assertions
                (planUpdateRes.body._id).should.equal(planSaveRes.body._id);
                (planUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Plans if not signed in', function (done) {
    // Create new Plan model instance
    var planObj = new Plan(plan);

    // Save the plan
    planObj.save(function () {
      // Request Plans
      request(app).get('/api/plans')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Plan if not signed in', function (done) {
    // Create new Plan model instance
    var planObj = new Plan(plan);

    // Save the Plan
    planObj.save(function () {
      request(app).get('/api/plans/' + planObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', plan.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Plan with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/plans/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Plan is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Plan which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Plan
    request(app).get('/api/plans/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Plan with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Plan if signed in', function (done) {
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

        // Save a new Plan
        agent.post('/api/plans')
          .send(plan)
          .expect(200)
          .end(function (planSaveErr, planSaveRes) {
            // Handle Plan save error
            if (planSaveErr) {
              return done(planSaveErr);
            }

            // Delete an existing Plan
            agent.delete('/api/plans/' + planSaveRes.body._id)
              .send(plan)
              .expect(200)
              .end(function (planDeleteErr, planDeleteRes) {
                // Handle plan error error
                if (planDeleteErr) {
                  return done(planDeleteErr);
                }

                // Set assertions
                (planDeleteRes.body._id).should.equal(planSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Plan if not signed in', function (done) {
    // Set Plan user
    plan.user = user;

    // Create new Plan model instance
    var planObj = new Plan(plan);

    // Save the Plan
    planObj.save(function () {
      // Try deleting Plan
      request(app).delete('/api/plans/' + planObj._id)
        .expect(403)
        .end(function (planDeleteErr, planDeleteRes) {
          // Set message assertion
          (planDeleteRes.body.message).should.match('User is not authorized');

          // Handle Plan error error
          done(planDeleteErr);
        });

    });
  });

  it('should be able to get a single Plan that has an orphaned user reference', function (done) {
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

          // Save a new Plan
          agent.post('/api/plans')
            .send(plan)
            .expect(200)
            .end(function (planSaveErr, planSaveRes) {
              // Handle Plan save error
              if (planSaveErr) {
                return done(planSaveErr);
              }

              // Set assertions on new Plan
              (planSaveRes.body.name).should.equal(plan.name);
              should.exist(planSaveRes.body.user);
              should.equal(planSaveRes.body.user._id, orphanId);

              // force the Plan to have an orphaned user reference
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

                    // Get the Plan
                    agent.get('/api/plans/' + planSaveRes.body._id)
                      .expect(200)
                      .end(function (planInfoErr, planInfoRes) {
                        // Handle Plan error
                        if (planInfoErr) {
                          return done(planInfoErr);
                        }

                        // Set assertions
                        (planInfoRes.body._id).should.equal(planSaveRes.body._id);
                        (planInfoRes.body.name).should.equal(plan.name);
                        should.equal(planInfoRes.body.user, undefined);

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
      Plan.remove().exec(done);
    });
  });
});
