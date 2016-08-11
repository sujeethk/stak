'use strict';

describe('Teams E2E Tests:', function () {
  describe('Test Teams page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/teams');
      expect(element.all(by.repeater('team in teams')).count()).toEqual(0);
    });
  });
});
