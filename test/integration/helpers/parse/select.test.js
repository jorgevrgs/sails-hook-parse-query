describe('Select', function () {
  it('Should return an array for select string', function () {
    const select = sails.helpers.parse.select({ select: 'foo,bar' });

    assert.sameMembers(select, ['foo', 'bar']);
  });
});
