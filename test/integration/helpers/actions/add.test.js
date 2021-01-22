var pet;
var user;

describe('Add Action', function () {
  before(async function () {
    // Create an orphan child
    pet = await Pet.create({ name: 'Pet Without Parent' });
    user = await user.create({
      fullName: 'Parent Without Pet',
      emailAddress: 'no-pet@user.com',
      password: 'abc123',
    });
  });

  after(async function () {
    // Delete the orphan one
    await Pet.destroyOne({ id: pet.id });
    await User.destroyOne({ id: user.id });
  });

  it('Should add a pet to the user', async function () {
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
    assert.isDefined(res);
  });
});
