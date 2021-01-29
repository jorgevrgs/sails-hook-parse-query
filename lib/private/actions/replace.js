module.exports = {
  friendlyName: 'Replace Helper action',

  description:
    'Replace all of the foreign records in one of this record\'s collections (e.g. "comments").',

  extendedDescription: `This helper is intended to use in the controller directly
  to replace all the children from a parent model. i.e.:

    ### Route
    PUT /api/v1/users/:id/:association

    ### Request
    DELETE /api/v1/users/1/pets/2

    ### Actions
    inputs: {
      id: {
        type: 'string',
        required: true
      },
      association: {
        type: 'string',
        required: true
      },
      fks: {
        type: 'json',
        required: true
      }
    },
    fn: function(inputs, exits, ctx) {
      const model = 'user';
      const query = ctx.req.query;
      const filter = await sails.helpers.parse.query(model, 'replace', query, inputs);
        .intercept('badRequest', 'badRequest')
        .intercept('notFound', 'notFound');

      const user = await sails.helpers.actions.replace(filter)
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

    const relation = filter.alias;

    // The primary key of the parent record
    const parentPk = filter.targetRecordId;

    const childPks = filter.associatedIds;

    await Model.replaceCollection(parentPk, relation, childPks)
      .intercept('E_UNIQUE', 'serverError')
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    const matchingRecord = await Model.findOne(parentPk, filter.populates)
      .meta(filter.meta)
      .intercept((err) => exits.serverError(err));

    if (!matchingRecord || !matchingRecord[relation]) {
      return exits.serverError();
    }

    return exits.success(matchingRecord);
  },
};
