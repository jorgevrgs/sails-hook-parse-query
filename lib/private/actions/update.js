module.exports = {
  friendlyName: 'Replace Helper action',

  description: 'Update an existing record in the database.',

  extendedDescription: `This helper is intended to use in the controller directly
  to update a record in the database. i.e.:

    ### Route
    PATCH /api/v1/users/:id

    ### Request
    PATCH /api/v1/users/1

    ### Actions
    inputs: {
      id: {
        type: 'string',
        required: true
      },
      fullName: {
        type: 'string'
      },
      emailAddress: {
        type: 'string'
      }
    },
    fn: function(inputs, exits, ctx) {
      const model = 'user';
      const query = ctx.req.query;
      const filter = await sails.helpers.parse.query(model, 'update', query, inputs);
        .intercept('cannotParseQuery', 'badRequest')
        .intercept('modelNotFound', 'notFound');

      const user = await sails.helpers.actions.update(filter)
        .intercept('badRequest', 'badRequest')
        .intercept('serverError', 'serverError')
        .intercept('notFound', 'notFound');

      return exits.ok(user);
    }
  `,

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
    success: {
      description: 'All done.',
    },

    badRequest: {
      description: 'A database error was received',
    },

    serverError: {
      description: 'An unexpected error was received.',
    },
  },

  fn: async function ({ filter }, exits) {
    const Model = sails.helpers.parse.model(filter.using);

    const criteria = {};
    criteria[Model.primaryKey] = filter.criteria.where[Model.primaryKey];

    const matchingRecord = await Model.findOne(
      _.cloneDeep(criteria),
      _.cloneDeep(filter.populates)
    ).intercept({ name: 'UsageError' }, (err) => exits.badRequest(err));

    if (!matchingRecord) {
      return exits.notFound();
    } //•

    const updatedRecord = await Model.updateOne(_.cloneDeep(criteria))
      .set(filter.valuesToSet)
      .meta(filter.meta)
      .intercept('E_UNIQUE', 'badRequest')
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    if (!updatedRecord) {
      return exits.notFound();
    } //•

    const populatedRecord = await Model.findOne(
      _.cloneDeep(criteria),
      _.cloneDeep(filter.populates)
    ).intercept((err) => exits.serverError(err));

    if (!populatedRecord) {
      return exits.notFound();
    }

    return exits.success(populatedRecord);
  },
};
