// var user;
const faker = require('faker');

describe('Create Action', function () {
  it('Should create and fetch with params', async function () {
    const filter = sails.helpers.parse.query(
      'user',
      'create',
      {},
      {
        fullName: 'Create Alone',
        emailAddress: 'create-alone@example.com',
        password: 'abc123',
      }
    );

    const user = await sails.helpers.actions.create(filter);

    assert.isDefined(user.id);

    await User.destroyOne({ id: user.id });
  });

  it('Should populate when include children', async function () {
    const pets = await Pet.find();
    const petIds = pets.map((pet) => pet.id);
    const filter = sails.helpers.parse.query(
      'user',
      'create',
      {},
      {
        fullName: 'Create Children',
        emailAddress: 'create-children@example.com',
        password: 'abc123',
        pets: faker.random.arrayElements(petIds, 2),
      }
    );

    const user = await sails.helpers.actions.create(filter);

    assert.lengthOf(user.pets, 2);

    await User.destroyOne({ id: user.id });
  });

  it('Sould receive an error for missing field', async function () {
    const filter = sails.helpers.parse.query(
      'user',
      'create',
      {},
      {
        fullName: 'Create Missing',
        emailAddress: 'create-missing@example.com',
      }
    );

    try {
      await sails.helpers.actions.create(filter);
    } catch (error) {
      assert.equal(error.code, 'badRequest');
    }
  });

  it('Sould receive an error for duplicated entry', async function () {
    const users = await User.find();
    const user = users[0];

    const filter = sails.helpers.parse.query(
      'user',
      'create',
      {},
      {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        password: user.password,
      }
    );

    try {
      await sails.helpers.actions.create(filter);
    } catch (error) {
      assert.equal(error.code, 'conflict');
    }
  });
});
