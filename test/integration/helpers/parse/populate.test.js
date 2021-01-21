describe('Populate', function () {
  it('Should return {foo: {}, bar: {}} for populate string', function () {
    const populate = sails.helpers.parse.populate({ populate: 'foo,bar' });

    assert.hasAllKeys(populate, ['foo', 'bar']);
  });

  it('Should return {} for populate false', function () {
    const populate = sails.helpers.parse.populate({
      populate: 'false',
    });

    assert.isEmpty(populate);
  });
});
