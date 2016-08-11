'use strict';

describe('Plans E2E Tests:', function () {
  describe('Test Plans page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/plans');
      expect(element.all(by.repeater('plan in plans')).count()).toEqual(0);
    });
  });
});
