module.exports = {
  friendlyName: 'Filter Replace',

  description: 'Get the filters to replace all associations from a model.',

  sync: true,

  inputs: {
    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
        association: 'pets',
        fks: [45, 60],
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
      throw new Error('Missing required parameter, `association`.');
    }
    queryOptions.alias = params.association;

    queryOptions.criteria = {};

    queryOptions.criteria = {
      where: {},
    };

    queryOptions.targetRecordId = params.id;

    queryOptions.associatedIds = params.fks;

    return exits.success(queryOptions);
  },
};
