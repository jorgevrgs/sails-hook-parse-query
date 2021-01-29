module.exports = {
  friendlyName: 'Add Helper action',

  description:
    'Add a foreign record (e.g. a comment) to one of this record\'s collections (e.g. "comments").',

  extendedDescription: `This helper is intended to use in the controller directly
    to add an item to a parent in the database. i.e.:

    ### Route
    PUT /api/v1/users/:id/:association/:fk

    ### Request
    PUT /api/v1/users/1/pets/2

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
      const filter = sails.helpers.parse.query(model, 'add', {}, inputs);
        .intercept('badRequest', 'badRequest')
        .intercept('notFound', 'notFound');

      const item = await sails.helpers.actions.add(filter)
        .intercept('notFound', 'notFound')
        .intercept('serverError', 'serverError');

      return exits.ok(item);
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
      description: 'The model does not exists.',
    },

    serverError: {
      description: 'An unexpected answer was received.',
    },
  },

  fn: async function ({ filter }, exits) {
    // Get the model class
    const Model = sails.helpers.parse.model(filter.using);

    const relation = filter.alias;

    // The primary key of the parent record
    const parentPk = filter.targetRecordId;

    // Get the model class of the child in order to figure out the name of
    // the primary key attribute.
    const associationAttr = _.findWhere(Model.associations, {
      alias: relation,
    });
    const ChildModel = sails.models[associationAttr.collection];

    // The primary key of the child record;
    const childPk = filter.associatedIds;

    const parentRecord = await Model.findOne(parentPk).meta(filter.meta);

    // No such parent record?  Bail out with a 404.
    if (!parentRecord) {
      return exits.notFound();
    }

    // Look up the child record to make sure it exists.
    const childRecord = await ChildModel.findOne(childPk);

    // No such child record?  Bail out with a 404.
    if (!childRecord) {
      return exits.notFound();
    }

    // Add the child record to the parent.
    await Model.addToCollection(parentPk, relation, childPk);

    // Finally, look up the parent record again and populate the relevant collection.
    const matchingRecord = await Model.findOne(parentPk, filter.populates).meta(
      filter.meta
    );

    if (!matchingRecord || !matchingRecord[relation]) {
      return exits.serverError();
    }

    return exits.success(matchingRecord);
  },
};
