var user;
var pets;

describe('Actions - Remove', function () {
  before(async function () {
    user = await User.create({
      fullName: 'To Remove',
      emailAddress: 'to-remove@example.com',
      password: 'abc123',
    }).fetch();

    pets = await Pet.createEach([
      {
        name: 'To Remove One',
        user: user.id,
      },
      {
        name: 'To Remove Two',
        user: user.id,
      },
    ]).fetch();
  });

  after(async function () {
    await Pet.destroy({ id: { in: pets.map((pet) => pet.id) } });
    await User.destroyOne({ id: user.id });
  });

  it('Should remove a child from the parent', async function () {
    const filter = sails.helpers.parse.query(
      'user',
      'remove',
      {},
      {
        id: user.id,
        association: 'pets',
        fk: _.first(pets).id,
      }
    );

    user = await sails.helpers.actions.remove(filter);

    // The count of the pets for the user
    assert.lengthOf(user.pets, 1);

    // The remained pet should be the undeleted one
    assert.equal(_.first(user.pets).id, _.last(pets).id);
  });
});
