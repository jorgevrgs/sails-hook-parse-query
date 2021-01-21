module.exports = {
  friendlyName: 'Populates',

  description: 'Process populates from query string.',

  extendedDescription: `If a "populate" query parameter was sent, filter the attributes to populate
  against that value.
  e.g.:
  /model?populate=alias1,alias2,alias3
  /model?populate=[alias1,alias2,alias3]`,

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
    // Get the request param.
    let attributes = inputs.query.populate;
    // If it's `false`, populate nothing.
    if (attributes === 'false') {
      return {};
    }

    // Split the list on commas.
    attributes = attributes.split(',');
    // Trim whitespace off of the attributes.
    attributes = _.reduce(
      attributes,
      (memo, attribute) => {
        memo[attribute.trim()] = {};
        return memo;
      },
      {}
    );

    return attributes;
  },
};
