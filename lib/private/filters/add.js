module.exports = {
  friendlyName: 'Filter Add',

  description: 'Get the filters to add an association to a model.',

  sync: true,

  inputs: {
    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
        association: 'product',
        fk: 2,
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function ({ params }, exits) {
    sails.log.verbose('sails.helpers.filters.add', { params });

    let queryOptions = {};

    if (!params.association) {
      throw new Error('Missing required params, `association`.');
    }

    queryOptions.alias = params.association;

    queryOptions.targetRecordId = params.id;

    queryOptions.associatedIds = params.fk;

    return exits.success(queryOptions);
  },
};
