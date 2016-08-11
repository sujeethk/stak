'use strict';

describe('Releases E2E Tests:', function () {
  describe('Test Releases page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/releases');
      expect(element.all(by.repeater('release in releases')).count()).toEqual(0);
    });
  });
});
