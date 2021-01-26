var pets;
var pet;

describe('Find One Action', function () {
  before(async function () {
    pets = await Pet.find();
  });

  it('Should return an object if it is found', async function () {
    pet = _.first(pets);

    const filter = sails.helpers.parse.query(
      'pet',
      'findOne',
      {},
      { id: pet.id }
    );

    const res = await sails.helpers.actions.findOne(filter);

    assert.isDefined(res.id, pet.id);
  });

  it('Should return an object processing the query', async function () {
    const filter = sails.helpers.parse.query(
      'pet',
      'findOne',
      { select: 'id', populate: 'false' },
      { id: pet.id }
    );

    const res = await sails.helpers.actions.findOne(filter);

    assert.hasAllKeys(res, ['id']);
  });

  it('Should return an UsageError', async function () {
    const filter = sails.helpers.parse.query(
      'pet',
      'findOne',
      { select: 'id', populate: 'user' },
      { id: pet.id }
    );

    await sails.helpers.actions
      .findOne(filter)
      .tolerate((err) => assert.equal(err.code, 'badRequest'));
  });
});
