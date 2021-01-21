module.exports = {
  friendlyName: 'Filter Remove',

  description: 'Get the filters to remove an association from a model.',

  sync: true,

  inputs: {
    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
        association: 'pets',
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
    let queryOptions = {};

    if (!params.association) {
      throw new Error('Missing required route option, `association`.');
    }

    queryOptions.alias = params.association;

    queryOptions.targetRecordId = params.id;

    queryOptions.associatedIds = params.fk;

    return exits.success(queryOptions);
  },
};
