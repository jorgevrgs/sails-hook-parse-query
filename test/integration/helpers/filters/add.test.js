describe('Add', function () {
  it('Should return default object', function () {
    const add = sails.helpers.filters.add({
      id: 1,
      association: 'product',
      fk: 2,
    });

    assert.hasAllKeys(add, ['alias', 'targetRecordId', 'associatedIds']);
  });
});
