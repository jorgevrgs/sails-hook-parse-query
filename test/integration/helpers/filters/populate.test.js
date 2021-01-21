describe('Populate', function () {
  it('Should return an object without query', function () {
    const populate = sails.helpers.filters.populate(
      'user',
      {},
      { id: 1, association: 'pets' }
    );

    assert.hasAllKeys(populate, ['alias', 'criteria', 'populates']);
  });
});
