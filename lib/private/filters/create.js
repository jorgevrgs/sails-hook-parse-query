module.exports = {
  friendlyName: 'Filter Create',

  description: 'Get the filters to create an object.',

  sync: true,

  inputs: {
    params: {
      type: 'ref',
      description: 'Request params parameter',
      example: {
        firstName: 'John Doe',
        emailAddress: 'user@example.com',
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function ({ params }, exits) {
    let queryOptions = {};
    // Set `fetch: true`
    queryOptions.meta = { fetch: true };

    queryOptions.newRecord = params;

    return exits.success(queryOptions);
  },
};
