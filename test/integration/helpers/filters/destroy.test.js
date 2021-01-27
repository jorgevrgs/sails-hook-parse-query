describe('Filters - Destroy', function () {
  it('Should return default object', function () {
    const destroy = sails.helpers.filters.destroy('user', {
      id: 1,
    });

    assert.hasAllKeys(destroy, ['criteria', 'meta']);
  });
});
