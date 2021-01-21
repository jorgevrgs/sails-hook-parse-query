module.exports = {
  friendlyName: 'Limit',

  description: 'Process limit from query string.',

  sync: true,

  inputs: {
    query: {
      type: 'ref',
      description: 'Query content',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function ({ query }) {
    sails.log.verbose('sails.helpers.parse.limit', query);

    const DEFAULT_LIMIT = sails.config.pagination.defaultLimit || 30;
    const MAX_LIMIT = sails.config.pagination.maxLimit || 100;

    let limit;

    if (typeof query.limit === 'undefined') {
      // Process as perPage
      query.perPage = parseInt(query.perPage) || DEFAULT_LIMIT;
      query.limit = query.perPage > 1 ? query.perPage : DEFAULT_LIMIT;
    }

    query.limit = query.limit > MAX_LIMIT ? MAX_LIMIT : query.limit;

    if (!_.isUndefined(query.limit)) {
      limit = query.limit;
    } else {
      limit = DEFAULT_LIMIT;
    }

    return limit;
  },
};
