module.exports = {
  friendlyName: 'Select',

  description: 'Process select from query string.',

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
    return inputs.query.select.split(',').map((attribute) => attribute.trim());
  },
};
