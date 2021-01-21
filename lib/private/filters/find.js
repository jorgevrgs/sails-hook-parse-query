module.exports = {
  friendlyName: 'Filter',

  description: 'Get the object to filter a model for pagination.',

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
  },

  exits: {
    success: {
      description: 'All done.',
    },

    modelNotFound: {
      description: 'The model object does not exist in `sails.models`',
    },

    cannotParseQuery: {
      description: 'An invalid query value has been received',
    },
  },

  fn: function ({ model, query }, exits) {
    sails.log.verbose('sails.helpers.filters.find', { model, query });

    let queryOptions = {};
    queryOptions.criteria = {};

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ╔═╗╦═╗╦╔╦╗╔═╗╦═╗╦╔═╗
    //  ├─┘├─┤├┬┘└─┐├┤   ║  ╠╦╝║ ║ ║╣ ╠╦╝║╠═╣
    //  ┴  ┴ ┴┴└─└─┘└─┘  ╚═╝╩╚═╩ ╩ ╚═╝╩╚═╩╩ ╩
    queryOptions.criteria.where = sails.helpers.parse.where(query);

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

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┬  ┬┌┬┐┬┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   │  │││││ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴─┘┴┴ ┴┴ ┴
    queryOptions.criteria.limit = sails.helpers.parse.limit(query);

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┬┌─┬┌─┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐├┴┐│├─┘
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘┴ ┴┴┴
    if (!_.isUndefined(query.skip) || !_.isUndefined(query.page)) {
      queryOptions.criteria.skip = sails.helpers.parse.skip(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┬─┐┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐│ │├┬┘ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘└─┘┴└─ ┴
    if (!_.isUndefined(query.sort)) {
      queryOptions.criteria.sort = sails.helpers.parse.sort(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┌─┐┬ ┬┬  ┌─┐┌┬┐┌─┐
    //  ├─┘├─┤├┬┘└─┐├┤   ├─┘│ │├─┘│ ││  ├─┤ │ ├┤
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴  └─┘┴  └─┘┴─┘┴ ┴ ┴ └─┘
    if (query.populate) {
      queryOptions.populates = sails.helpers.parse.populate(query);
    }

    /**
     * queryOptions: {
     * criteria: {where, select, omit, limit, skip, sort, select, omit, populate}
     * populates
     * }
     */
    return exits.success(queryOptions);
  },
};
