describe('Filters - Find', function () {
  it('Should return an object without query', function () {
    const find = sails.helpers.filters.find('user', {});

    assert.hasAllKeys(find, ['criteria']);
  });

  it('Should return an object with "perPage" query', function () {
    const find = sails.helpers.filters.find('user', { perPage: 50 });

    assert.equal(find.criteria.limit, 50);
  });

  it('Should return an object with "page" query', function () {
    const find = sails.helpers.filters.find('user', { page: 2 });

    assert.equal(find.criteria.skip, sails.config.pagination.defaultLimit);
  });
});
