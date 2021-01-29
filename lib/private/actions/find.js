module.exports = {
  friendlyName: 'Find Helper action',

  description: 'Helper to get list and count of a model',

  extendedDescription: `This helper is intended to use in the controller directly
to get list and count objects from the database. i.e.:

  ### Request
  GET /api/v1/products?page=2&perPage=10

  ### Actions
  fn: function(inputs, exits, ctx) {
    const model = 'product';
    const query = ctx.req.query;
    const filter = await sails.helpers.parse.query(model, 'find', query);
      .intercept('badRequest', 'badRequest')
      .intercept('notFound', 'notFound');

    const { list, count } = await sails.helpers.actions.find(filter)
      .intercept('notFound', 'notFound');

    return exits.ok({list, count});
  }
`,

  inputs: {
    filter: {
      type: 'ref',
      description: 'An object response from "sails.helpers.parse.query"',
      required: true,
      example: {
        using: 'user',
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
      description: 'The model does not exists.',
    },
  },

  fn: async function ({ filter }, exits) {
    sails.log.verbose('sails.helpers.actions.find', { filter });

    // Get the model class
    const Model = sails.helpers.parse.model(filter.using);

    // Get list and count values from the Model
    const makeLikeModifierCaseInsensitive = true; // @TODO: config.pagination?
    const list = await Model.find(filter.criteria, filter.populates).meta(
      _.extend(filter.meta, makeLikeModifierCaseInsensitive)
    );

    const count = await Model.count(filter.criteria.where).meta(
      _.extend(filter.meta, makeLikeModifierCaseInsensitive)
    );

    return exits.success({
      list,
      count,
    });
  },
};
