var pet;

describe('Actions - Update', function () {
  before(async function () {
    pet = await Pet.create({ name: 'To Be Updated' }).fetch();
  });

  after(async function () {
    await Pet.destroy({ id: pet.id });
  });

  it('Should update a record', async function () {
    const filter = sails.helpers.parse.query(
      'pet',
      'update',
      {},
      {
        id: pet.id,
        name: 'Updated Name',
      }
    );

    const res = await sails.helpers.actions.update(filter);

    assert.equal(res.name, 'Updated Name');
  });
});
