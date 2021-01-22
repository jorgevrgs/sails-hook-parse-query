describe('Find Action', function () {
  it('Should return ["list", "count"] array', async function () {
    const filter = await sails.helpers.parse.query('user', 'find');

    const res = await sails.helpers.actions.find(filter);

    assert.hasAllKeys(res, ['list', 'count']);
  });

  it('Should return five (5) items in list', async function () {
    const filter = await sails.helpers.parse.query('user', 'find', {
      perPage: 5,
    });

    const res = await sails.helpers.actions.find(filter);

    assert.equal(res.list.length, 5);
  });

  it('Should be equal with "perPage" and "limit" query', async function () {
    const filter = await sails.helpers.parse.query('user', 'find', {
      limit: 5,
    });

    const res = await sails.helpers.actions.find(filter);

    assert.equal(res.list.length, 5);
  });
});
