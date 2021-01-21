describe('Update', function () {
  it('Should return an object with all the required params', function () {
    const update = sails.helpers.filters.update('user', {
      id: 1,
      fullName: 'John Doe',
    });

    assert.hasAllKeys(update, ['meta', 'criteria', 'valuesToSet']);
  });
});
