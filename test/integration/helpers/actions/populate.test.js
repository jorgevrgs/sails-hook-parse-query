// var users;
var user;
var pets;
var pet;

describe('Actions - Populate', function () {
  before(async function () {
    pets = await Pet.find({ where: { user: { '!=': null } } });
    pet = pets[0];

    user = await User.findOne({ id: pet.user });
  });

  it('Should return the populated items', async function () {
    const filter = sails.helpers.parse.query(
      'user',
      'populate',
      {},
      {
        id: user.id,
        association: 'pets',
      }
    );

    const res = await sails.helpers.actions.populate(filter);

    assert.isAbove(res.length, 0);
  });

  // @TODO: with the current method is unavailable to paginate populates
});
