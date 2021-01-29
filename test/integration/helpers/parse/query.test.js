describe('Parse - Query', function () {
  it('Should return an object using an empty query', async function () {
    const query = sails.helpers.parse.query('user', 'find');

    assert.hasAllKeys(query, ['using', 'criteria', 'populates']);
  });
});
