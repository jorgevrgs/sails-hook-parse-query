describe('Parse - Omit', function () {
  it('Should return an array for omit string', function () {
    const omit = sails.helpers.parse.omit({ omit: 'foo,bar' });

    assert.sameMembers(omit, ['foo', 'bar']);
  });
});
