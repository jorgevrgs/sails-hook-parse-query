module.exports = {
  friendlyName: 'Filter Destroy',

  description: 'Get the filters to destroy an object.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Model name',
      example: 'product',
    },

    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function ({ model, params }, exits) {
    sails.log.verbose('sails.helpers.filters.destroy', { model, params });

    let queryOptions = {};
    const Model = sails.helpers.parse.model(model);

    queryOptions.criteria = {};

    queryOptions.criteria = {
      where: {},
    };

    queryOptions.criteria.where[Model.primaryKey] = params.id;

    // Set `fetch: true`
    queryOptions.meta = { fetch: true };

    return exits.success(queryOptions);
  },
};
