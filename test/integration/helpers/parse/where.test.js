describe('Parse - Where', function () {
  it('Should return a value for where string', function () {
    const where = sails.helpers.parse.where({
      where: '{"name": "John Doe"}',
    });

    assert.equal(where.name, 'John Doe');
  });

  it('Should throw an exception if where is not JSON', function () {
    try {
      sails.helpers.parse.where({
        where: '{"name": "John Doe"',
      });
    } catch (error) {
      assert.equal(error.code, 'badRequest');
    }
  });
});
