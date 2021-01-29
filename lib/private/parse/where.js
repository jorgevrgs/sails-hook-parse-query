module.exports = {
  friendlyName: 'Where',

  description: 'Process where from query string.',

  sync: true,

  inputs: {
    query: {
      type: 'ref',
      description: 'Query content',
      required: true,
      example: {
        where: '{"name": "John Doe"}',
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },

    badRequest: {
      description: 'An invalid query value has been received',
    },
  },

  fn: function (inputs, exits) {
    let where = inputs.query.where;

    if (_.isString(where)) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        return exits.badRequest(e);
      }
    } //>-•

    if (!where) {
      // Prune params which aren't fit to be used as `where` criteria
      // to build a proper where query
      where = inputs.query;

      // Omit built-in runtime config (like query modifiers)
      where = _.omit(where, [
        'limit',
        'skip',
        'sort',
        'populate',
        'select',
        'omit',
        'page', // Custom pagination
        'perPage', // Custom pagination
      ]);

      // Omit any params that have `undefined` on the RHS.
      where = _.omit(where, (p) => {
        if (_.isUndefined(p)) {
          return true;
        }
      });
    } //>-

    return exits.success(where);
  },
};
