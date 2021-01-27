module.exports = {
  friendlyName: 'Remove Helper action',

  description:
    'Remove a foreign record (e.g. a comment) from one of this record\'s collections (e.g. "comments").',

  extendedDescription: `This helper is intended to use in the controller directly
  to remove a child from a parent model. i.e.:

    ### Route
    DELETE /api/v1/users/:id/:association/:fk

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
      fk: {
        type: 'string',
        required: true
      }
    },
    fn: function(inputs, exits, ctx) {
      const model = 'user';
      const query = ctx.req.query;
      const filter = await sails.helpers.parse.query(model, 'remove', query, inputs);
        .intercept('cannotParseQuery', 'badRequest')
        .intercept('modelNotFound', 'notFound');

      const user = await sails.helpers.actions.remove(filter)
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

    notFound: {
      description: 'The parent or child record does not exist.',
    },

    serverError: {
      description: 'An unexpected response was received.',
    },
  },

  fn: async function ({ filter }, exits) {
    const Model = sails.helpers.parse.model(filter.using);

    const relation = filter.alias;

    // The primary key of the parent record
    const parentPk = filter.targetRecordId;

    // Get the model class of the child in order to figure out the name of
    // the primary key attribute.
    const associationAttr = _.findWhere(Model.associations, {
      alias: relation,
    });

    const ChildModel = sails.helpers.parse.model(associationAttr.collection);

    // The primary key of the child record;
    const childPk = filter.associatedIds;

    const parentRecord = await Model.findOne(parentPk)
      .meta(filter.meta)
      .intercept((err) => exits.serverError(err));

    if (!parentRecord) {
      return exits.notFound();
    }

    // Look up the child record to make sure it exists.
    const childRecord = await ChildModel.findOne(childPk).intercept((err) =>
      exits.serverError(err)
    );

    if (!childRecord) {
      return exits.notFound();
    }

    await Model.removeFromCollection(parentPk, relation, childPk)
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    const updatedParentRecord = await Model.findOne(
      parentPk,
      filter.populates
    ).meta(filter.meta);

    if (
      !updatedParentRecord ||
      !updatedParentRecord[relation] ||
      !updatedParentRecord[Model.primaryKey]
    ) {
      return exits.serverError();
    }

    return exits.success(updatedParentRecord);
  },
};
