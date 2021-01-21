describe('Load Helpers', function () {
  [
    'limit',
    'model',
    'omit',
    'populate',
    'query',
    'select',
    'skip',
    'sort',
    'where',
  ].forEach((helper) => {
    it(`sails.helpers.parse.${helper} should be defined`, function () {
      assert.isDefined(sails.helpers.parse[helper]);
    });
  });
});
