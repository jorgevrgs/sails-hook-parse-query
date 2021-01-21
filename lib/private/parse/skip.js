module.exports = {
  friendlyName: 'Skip',

  description: 'Process skip from query string.',

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
    sails.log.verbose('sails.helpers.parse.skip', query);

    if (typeof query.skip === 'undefined') {
      // Process as page
      query.limit = sails.helpers.parse.limit(query);
      query.page = parseInt(query.page) || 1;
      query.page = query.page > 1 ? query.page : 1;
      query.skip = query.limit * query.page - query.limit;
    }

    return query.skip;
  },
};
