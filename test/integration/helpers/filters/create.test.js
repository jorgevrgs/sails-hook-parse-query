describe('Filters - Create', function () {
  it('Should return default object', function () {
    const add = sails.helpers.filters.create({
      firstName: 'John Doe',
      emailAddress: 'user@example.com',
    });

    assert.hasAllKeys(add, ['meta', 'newRecord']);
  });
});
