module.exports = {
  friendlyName: 'Omit',

  description: 'Process omit from query string.',

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
    return inputs.query.omit.split(',').map((attribute) => attribute.trim());
  },
};
