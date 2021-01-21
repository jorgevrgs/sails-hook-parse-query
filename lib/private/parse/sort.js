module.exports = {
  friendlyName: 'Sort',

  description: 'Process sort from query string.',

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

  fn: function (inputs) {
    let sort = inputs.query.sort;
    if (_.isUndefined(sort)) {
      return undefined;
    }

    // If `sort` is a string, attempt to JSON.parse() it.
    // (e.g. `{"name": 1}`)
    if (_.isString(sort)) {
      try {
        sort = JSON.parse(sort);
        // If it is not valid JSON (e.g. because it's just some other string),
        // then just fall back to interpreting it as-is (e.g. "name ASC")
      } catch (unusedErr) {}
    }

    return sort;
  },
};
