describe('Filters - Find One', function () {
  it('Should return default object without query', function () {
    const findOne = sails.helpers.filters.findOne('user', {}, { id: 1 });

    // assert.hasAllKeys(destroy, ['criteria', 'meta']);
    assert.deepEqual(findOne, { criteria: { where: { id: 1 } } });
  });
});
