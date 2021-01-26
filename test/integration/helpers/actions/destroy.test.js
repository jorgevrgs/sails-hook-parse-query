describe('Destroy Action', function () {
  it('Should delete a record', async function () {
    const pet = await Pet.create({
      name: 'To Delete',
    }).fetch();

    const filter = sails.helpers.parse.query(
      'pet',
      'destroy',
      {},
      {
        id: pet.id,
      }
    );

    const record = await sails.helpers.actions.destroy(filter);

    assert.equal(pet.id, record.id);
  });

  it('Should answer for a deleted record', async function () {
    const pet = await Pet.create({
      name: 'Deleted Record',
    }).fetch();

    const filter = sails.helpers.parse.query(
      'pet',
      'destroy',
      {},
      {
        id: pet.id,
      }
    );

    // Previously deleted
    await Pet.destroyOne({ id: pet.id });

    await sails.helpers.actions
      .destroy(filter)
      .tolerate((err) => assert.equal(err.code, 'notFound'));
  });
});
