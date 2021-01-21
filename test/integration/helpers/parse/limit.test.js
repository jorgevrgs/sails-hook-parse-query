describe('Limit', function () {
  it('Should return default limit if empty', function () {
    const limit = sails.helpers.parse.limit({});

    assert.equal(limit, sails.config.pagination.defaultLimit);
  });

  it('Should return the limit in query', function () {
    const limit = sails.helpers.parse.limit({ limit: 30 });

    assert.equal(limit, 30);
  });
});
