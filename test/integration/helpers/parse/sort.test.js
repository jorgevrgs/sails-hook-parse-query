describe('Parse - Sort', function () {
  it('Should return a undefined for empty', function () {
    const sort = sails.helpers.parse.sort({});

    assert.isUndefined(sort);
  });

  it('Should return a string for string', function () {
    const sort = sails.helpers.parse.sort({ sort: 'name ASC' });

    assert.equal(sort, 'name ASC');
  });

  it('Should return an object for json', function () {
    const sort = sails.helpers.parse.sort({ sort: '{"name": 1}' });

    assert.equal(sort.name, 1);
  });
});
