module.exports = {
  friendlyName: 'Find Helper action',

  description: 'Helper to get list and count of a model',

  extendedDescription: `This helper is intended to use in the controller directly
to get list and count objects from the database. i.e.:

  const model = 'product';
  const filter = await sails.helpers.filters.findOne(
    model,
    id: inputs.id,
    _.extend(this.req.query, { where: "{ userId: me.id }" })
  )
    .intercept('invalid', 'badRequest')
    .intercept('modelNotFound', 'notFound');

  const { list, count } = await sails.helpers.actions.
    findOnde(model, filter)
    .intercept('modelNotFound', 'notFound');
`,

  inputs: {
    filter: {
      type: 'ref',
      required: true,
      example: {
        criteria: {},
        populates: {},
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },

    notFound: {
      description: 'No record found with the specified `id`.',
    },

    badRequest: {
      description: 'An UsageError was received',
    },

    serverError: {
      description: 'An unknown error was received',
    },
  },

  fn: async function ({ filter }, exits) {
    // Get the model class
    const Model = sails.helpers.parse.model(filter.using);

    // Only use the `where`, `select` or `omit` from the criteria (nothing else is valid for findOne).
    filter.criteria = _.pick(filter.criteria, ['where', 'select', 'omit']);

    // Only use the primary key in the `where` clause.
    filter.criteria.where = _.pick(filter.criteria.where, Model.primaryKey);

    const matchingRecord = await Model.findOne(
      filter.criteria,
      filter.populates
    )
      .meta(filter.meta)
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    if (!matchingRecord) {
      return exits.notFound();
    }

    return exits.success(matchingRecord);
  },
};
