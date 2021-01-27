module.exports = {
  friendlyName: 'Find Helper action',

  description: 'Helper to get list and count of a model',

  extendedDescription: `This helper is intended to use in the controller directly
to get an intem from the database. i.e.:

  ### Request
  GET /api/v1/products/1

  ### Actions
  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },
  fn: function(inputs, exits, ctx) {
    const model = 'product';
    const query = ctx.req.query;
    const filter = await sails.helpers.parse.query(model, 'findOne', query, inputs);
      .intercept('cannotParseQuery', 'badRequest')
      .intercept('modelNotFound', 'notFound');

    const item = await sails.helpers.actions.findOne(filter)
      .intercept('modelNotFound', 'notFound');

    return exits.ok(item);
  }
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
