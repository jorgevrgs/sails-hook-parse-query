const libraryContents = require('../../../lib/private/LIBRARY_CONTENTS');
const _ = require('@sailshq/lodash');

Object.keys(libraryContents).forEach((library) => {
  const helpers = libraryContents[library];

  describe(`Load "${library}" Helpers`, function () {
    helpers.methodIdts.forEach((helper) => {
      it(`sails.helpers.${library}.${_.camelCase(
        helper
      )} should be defined`, function () {
        assert.isDefined(sails.helpers[library][_.camelCase(helper)]);
      });
    });
  });
});
