'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Domain = mongoose.model('Domain'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, domain;

/**
 * Domain routes tests
 */
describe('Domain CRUD tests', function () {

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

    // Save a user to the test db and create new Domain
    user.save(function () {
      domain = {
        name: 'Domain name'
      };

      done();
    });
  });

  it('should be able to save a Domain if logged in', function (done) {
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

        // Save a new Domain
        agent.post('/api/domains')
          .send(domain)
          .expect(200)
          .end(function (domainSaveErr, domainSaveRes) {
            // Handle Domain save error
            if (domainSaveErr) {
              return done(domainSaveErr);
            }

            // Get a list of Domains
            agent.get('/api/domains')
              .end(function (domainsGetErr, domainsGetRes) {
                // Handle Domain save error
                if (domainsGetErr) {
                  return done(domainsGetErr);
                }

                // Get Domains list
                var domains = domainsGetRes.body;

                // Set assertions
                (domains[0].user._id).should.equal(userId);
                (domains[0].name).should.match('Domain name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Domain if not logged in', function (done) {
    agent.post('/api/domains')
      .send(domain)
      .expect(403)
      .end(function (domainSaveErr, domainSaveRes) {
        // Call the assertion callback
        done(domainSaveErr);
      });
  });

  it('should not be able to save an Domain if no name is provided', function (done) {
    // Invalidate name field
    domain.name = '';

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

        // Save a new Domain
        agent.post('/api/domains')
          .send(domain)
          .expect(400)
          .end(function (domainSaveErr, domainSaveRes) {
            // Set message assertion
            (domainSaveRes.body.message).should.match('Please fill Domain name');

            // Handle Domain save error
            done(domainSaveErr);
          });
      });
  });

  it('should be able to update an Domain if signed in', function (done) {
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

        // Save a new Domain
        agent.post('/api/domains')
          .send(domain)
          .expect(200)
          .end(function (domainSaveErr, domainSaveRes) {
            // Handle Domain save error
            if (domainSaveErr) {
              return done(domainSaveErr);
            }

            // Update Domain name
            domain.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Domain
            agent.put('/api/domains/' + domainSaveRes.body._id)
              .send(domain)
              .expect(200)
              .end(function (domainUpdateErr, domainUpdateRes) {
                // Handle Domain update error
                if (domainUpdateErr) {
                  return done(domainUpdateErr);
                }

                // Set assertions
                (domainUpdateRes.body._id).should.equal(domainSaveRes.body._id);
                (domainUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Domains if not signed in', function (done) {
    // Create new Domain model instance
    var domainObj = new Domain(domain);

    // Save the domain
    domainObj.save(function () {
      // Request Domains
      request(app).get('/api/domains')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Domain if not signed in', function (done) {
    // Create new Domain model instance
    var domainObj = new Domain(domain);

    // Save the Domain
    domainObj.save(function () {
      request(app).get('/api/domains/' + domainObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', domain.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Domain with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/domains/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Domain is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Domain which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Domain
    request(app).get('/api/domains/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Domain with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Domain if signed in', function (done) {
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

        // Save a new Domain
        agent.post('/api/domains')
          .send(domain)
          .expect(200)
          .end(function (domainSaveErr, domainSaveRes) {
            // Handle Domain save error
            if (domainSaveErr) {
              return done(domainSaveErr);
            }

            // Delete an existing Domain
            agent.delete('/api/domains/' + domainSaveRes.body._id)
              .send(domain)
              .expect(200)
              .end(function (domainDeleteErr, domainDeleteRes) {
                // Handle domain error error
                if (domainDeleteErr) {
                  return done(domainDeleteErr);
                }

                // Set assertions
                (domainDeleteRes.body._id).should.equal(domainSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Domain if not signed in', function (done) {
    // Set Domain user
    domain.user = user;

    // Create new Domain model instance
    var domainObj = new Domain(domain);

    // Save the Domain
    domainObj.save(function () {
      // Try deleting Domain
      request(app).delete('/api/domains/' + domainObj._id)
        .expect(403)
        .end(function (domainDeleteErr, domainDeleteRes) {
          // Set message assertion
          (domainDeleteRes.body.message).should.match('User is not authorized');

          // Handle Domain error error
          done(domainDeleteErr);
        });

    });
  });

  it('should be able to get a single Domain that has an orphaned user reference', function (done) {
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

          // Save a new Domain
          agent.post('/api/domains')
            .send(domain)
            .expect(200)
            .end(function (domainSaveErr, domainSaveRes) {
              // Handle Domain save error
              if (domainSaveErr) {
                return done(domainSaveErr);
              }

              // Set assertions on new Domain
              (domainSaveRes.body.name).should.equal(domain.name);
              should.exist(domainSaveRes.body.user);
              should.equal(domainSaveRes.body.user._id, orphanId);

              // force the Domain to have an orphaned user reference
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

                    // Get the Domain
                    agent.get('/api/domains/' + domainSaveRes.body._id)
                      .expect(200)
                      .end(function (domainInfoErr, domainInfoRes) {
                        // Handle Domain error
                        if (domainInfoErr) {
                          return done(domainInfoErr);
                        }

                        // Set assertions
                        (domainInfoRes.body._id).should.equal(domainSaveRes.body._id);
                        (domainInfoRes.body.name).should.equal(domain.name);
                        should.equal(domainInfoRes.body.user, undefined);

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
      Domain.remove().exec(done);
    });
  });
});
