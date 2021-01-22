module.exports = {
  friendlyName: 'Add Helper action',

  description:
    'Add a foreign record (e.g. a comment) to one of this record\'s collections (e.g. "comments").',

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
    const matchingRecord = Model.findOne(parentPk, filter.populates).meta(
      filter.meta
    );

    if (!matchingRecord || !matchingRecord[relation]) {
      return exits.serverError();
    }

    return exits.success(matchingRecord);
  },
};
