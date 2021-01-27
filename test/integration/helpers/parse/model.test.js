describe('Parse - Model', function () {
  it('Should return a model object', function () {
    const model = sails.helpers.parse.model('user');

    assert.equal(Object.getPrototypeOf(model).identity, 'user');
  });

  it('Should throw an exception', function () {
    try {
      sails.helpers.parse.model('xyz');
    } catch (error) {
      assert.equal(error.code, 'modelNotFound');
    }
  });
});
