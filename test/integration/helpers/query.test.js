describe('Query', function () {
  it('Should return an object', async function () {
    const query = await sails.helpers.parse.query('user', {}, {}, 'find');

    console.log({ query });
  });
});
