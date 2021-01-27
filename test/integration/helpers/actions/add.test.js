var pet;
var user;

describe('Actions - Add', function () {
  before(async function () {
    // Create an orphan child
    pet = await Pet.create({ name: 'Pet Without Parent' }).fetch();
    user = await User.create({
      fullName: 'Parent Without Pet',
      emailAddress: 'no-pet@user.com',
      password: 'abc123',
    }).fetch();
  });

  after(async function () {
    // Delete the orphan one
    await Pet.destroyOne({ id: pet.id });
    await User.destroyOne({ id: user.id });
  });

  it('Should add a child to the parent', async function () {
    const filter = sails.helpers.parse.query(
      'user',
      'add',
      {},
      {
        id: user.id,
        association: 'pets',
        fk: pet.id,
      }
    );

    const res = await sails.helpers.actions.add(filter);

    assert.equal(res.pets[0].id, pet.id);
  });
});
