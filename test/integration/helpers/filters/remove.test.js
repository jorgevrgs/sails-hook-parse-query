describe('Remove', function () {
  it('Should return an object with all the required params', function () {
    const remove = sails.helpers.filters.remove({
      id: 1,
      association: 'pets',
      fk: 2,
    });

    assert.hasAllKeys(remove, ['alias', 'targetRecordId', 'associatedIds']);
  });
});
