module.exports = {
  friendlyName: 'Filter',

  description: 'Get the object to filter a model for actions.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Model name',
      example: 'product',
    },

    action: {
      type: 'string',
      required: true,
      description: 'Action to perform in order to get filters',
      example: 'find',
      isIn: [
        'add',
        'create',
        'destroy',
        'find',
        'findOne',
        'populate',
        'remove',
        'replace',
        'update',
      ],
    },

    query: {
      type: 'ref',
      description: 'Request query parameter, not used in "update" filter',
      example: {
        page: 1,
        perPage: 100,
      },
      defaultsTo: {},
    },

    params: {
      type: 'ref',
      description: 'Request params parameter, required for "update" filter',
      example: {
        id: 1,
      },
      defaultsTo: {},
    },

    // body: {
    //   type: 'ref',
    //   description: 'Request body parameter, optional for "create" filter',
    //   defaultsTo: {},
    // },
  },

  exits: {
    success: {
      description: 'All done.',
    },

    notFound: {
      description: 'The model object does not exist in `sails.models`',
    },

    badRequest: {
      description: 'An invalid query value has been received',
    },
  },

  fn: function (inputs, exits) {
    sails.log.verbose('sails.helpers.parse.query', inputs);

    // Set some defaults.
    const DEFAULT_POPULATE_LIMIT =
      sails.config.pagination.defaultPopulateLimit || 30;

    let query = inputs.query;

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬
    //  ├─┘├─┤├┬┘└─┐├┤   ││││ │ ││├┤ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴ ┴└─┘─┴┘└─┘┴─┘

    let Model;
    try {
      Model = sails.helpers.parse.model(inputs.model);
    } catch (unusedErr) {
      return exits.notFound();
    }

    //  ┌┬┐┌─┐┌─┐┌─┐┬ ┬┬ ┌┬┐  ┌─┐┌─┐┌─┐┬ ┬┬  ┌─┐┌┬┐┌─┐┌─┐
    //   ││├┤ ├┤ ├─┤│ ││  │   ├─┘│ │├─┘│ ││  ├─┤ │ ├┤ └─┐
    //  ─┴┘└─┘└  ┴ ┴└─┘┴─┘┴   ┴  └─┘┴  └─┘┴─┘┴ ┴ ┴ └─┘└─┘

    // Get the default populates array
    const defaultPopulates = _.reduce(
      Model.associations,
      (memo, association) => {
        if (association.type === 'collection') {
          memo[association.alias] = {
            where: {},
            limit: DEFAULT_POPULATE_LIMIT,
            skip: 0,
            select: ['*'],
            omit: [],
          };
        } else {
          memo[association.alias] = {};
        }
        return memo;
      },
      {}
    );

    // Initialize the queryOptions dictionary we'll be returning.
    const queryOptions = {
      using: inputs.model,
      populates: defaultPopulates,
    };

    const action = _.camelCase(inputs.action);

    let withParams = {
      model: inputs.model,
      query,
      params: inputs.params,
    };

    switch (action) {
      case 'find':
        withParams = _.pick(withParams, ['model', 'query']);
        break;
      case 'add':
      case 'create':
      case 'remove':
      case 'replace':
        withParams = _.pick(withParams, ['params']);
        break;
      case 'destroy':
      case 'update':
        withParams = _.pick(withParams, ['model', 'params']);
        break;
      case 'findOne':
      case 'populate':
      default:
      // Nothing
    }

    try {
      const filtered = sails.helpers.filters[action].with(withParams);

      _.extend(queryOptions, filtered);

      return exits.success(queryOptions);
    } catch (unusedErr) {
      return exits.badRequest();
    }
  },
};
