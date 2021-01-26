module.exports = {
  friendlyName: 'Destroy Helper action',

  description: 'Destroy a record in the database.',

  inputs: {
    filter: {
      type: 'ref',
      description: 'An object response from "sails.helpers.parse.query"',
      required: true,
      example: {
        using: 'user',
        criteria: {},
        populates: {},
      },
    },
  },

  exits: {
    badRequest: {
      description: 'An UsageError was received',
    },

    notFound: {
      description: 'No record found with the specified `id`.',
    },

    serverError: {
      description: 'An unknown error was received',
    },
  },

  fn: async function ({ filter }, exits) {
    const Model = sails.helpers.parse.model(filter.using);

    let criteria = {};
    criteria[Model.primaryKey] = filter.criteria.where[Model.primaryKey];

    const record = await Model.findOne(_.cloneDeep(criteria), filter.populates)
      .meta(filter.meta)
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    if (!record) {
      return exits.notFound();
    }

    await Model.destroy(_.cloneDeep(criteria))
      .meta(filter.meta)
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    return exits.success(record);
  },
};
