module.exports = {
  friendlyName: 'Filter for findOne',

  description: 'Get the object for findOne controllers.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Model name',
      example: 'product',
    },

    query: {
      type: 'ref',
      required: true,
      description: 'Request query parameter',
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

    notFound: {
      description: 'The model object does not exist in `sails.models`',
    },

    badRequest: {
      description: 'An invalid query value has been received',
    },
  },

  fn: function ({ model, query, params }, exits) {
    sails.log.verbose('sails.helpers.filters.findOne', {
      model,
      query,
      params,
    });

    // Set query defaults if page is defined instead of skip
    let queryOptions = {};

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬
    //  ├─┘├─┤├┬┘└─┐├┤   ││││ │ ││├┤ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴ ┴└─┘─┴┘└─┘┴─┘

    // Get the model from input.
    const Model = sails.helpers.parse.model(model);

    queryOptions.criteria = {};

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ╔═╗╦═╗╦╔╦╗╔═╗╦═╗╦╔═╗
    //  ├─┘├─┤├┬┘└─┐├┤   ║  ╠╦╝║ ║ ║╣ ╠╦╝║╠═╣
    //  ┴  ┴ ┴┴└─└─┘└─┘  ╚═╝╩╚═╩ ╩ ╚═╝╩╚═╩╩ ╩
    queryOptions.criteria.where = (function getWhereCriteria() {
      let where = {};
      // For `findOne`, set "where" to just look at the primary key.
      where[Model.primaryKey] = params.id;
      return where;
    })();

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┬  ┌─┐┌─┐┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐├┤ │  ├┤ │   │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘└─┘┴─┘└─┘└─┘ ┴
    if (!_.isUndefined(query.select)) {
      queryOptions.criteria.select = sails.helpers.parse.select(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌┬┐┬┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   │ │││││ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘┴ ┴┴ ┴
    else if (!_.isUndefined(query.omit)) {
      queryOptions.criteria.omit = sails.helpers.parse.omit(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┌─┐┬ ┬┬  ┌─┐┌┬┐┌─┐
    //  ├─┘├─┤├┬┘└─┐├┤   ├─┘│ │├─┘│ ││  ├─┤ │ ├┤
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴  └─┘┴  └─┘┴─┘┴ ┴ ┴ └─┘
    if (query.populate) {
      queryOptions.populates = sails.helpers.parse.populate(query);
    }

    /**
     * queryOptions: {
     * criteria: {where, select, omit}
     * populates,
     * using
     * }
     */
    return exits.success(queryOptions);
  },
};
