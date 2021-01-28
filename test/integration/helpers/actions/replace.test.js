var pets;
var user;

describe('Actions - Replace', function () {
  before(async function () {
    user = await User.create({
      fullName: 'Parent To Replace',
      emailAddress: 'replace@example.com',
      password: 'abc123',
    }).fetch();

    pets = await Pet.createEach([
      { name: 'To Be Replaced', user: user.id },
      { name: 'To Replace' },
    ]).fetch();

    user = await User.findOne({ id: user.id }).populate('pets');
  });

  after(async function () {
    await Pet.destroy({ id: { in: _.map(pets, (pet) => pet.id) } });
    await User.destroyOne({ id: user.id });
  });

  it('Should replace a child in the parent', async function () {
    assert.equal(user.pets[0].id, pets[0].id);

    const filter = sails.helpers.parse.query(
      'user',
      'replace',
      {},
      {
        id: user.id,
        association: 'pets',
        fks: [pets[1].id],
      }
    );

    const res = await sails.helpers.actions.replace(filter);

    assert.equal(res.pets[0].id, pets[1].id);
  });
});
