'use strict';

describe('Domains E2E Tests:', function () {
  describe('Test Domains page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/domains');
      expect(element.all(by.repeater('domain in domains')).count()).toEqual(0);
    });
  });
});
