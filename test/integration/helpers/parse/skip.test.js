describe('Parse - Skip', function () {
  it('Should return a value for skip string', function () {
    const skip = sails.helpers.parse.skip({ skip: '30' });

    assert.equal(skip, '30');
  });
});
