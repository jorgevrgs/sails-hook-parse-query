describe('Replace', function () {
  it('Should return an object with all the required params', function () {
    const replace = sails.helpers.filters.replace({
      id: 1,
      association: 'pets',
      fks: [45, 60],
    });

    assert.hasAllKeys(replace, [
      'alias',
      'criteria',
      'targetRecordId',
      'associatedIds',
    ]);
  });
});
