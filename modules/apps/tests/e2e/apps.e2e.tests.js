'use strict';

describe('Apps E2E Tests:', function () {
  describe('Test Apps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/apps');
      expect(element.all(by.repeater('app in apps')).count()).toEqual(0);
    });
  });
});
