module.exports = {
  friendlyName: 'Populate Helper action',

  description: 'Populate a record from the database.',

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
    notFound: {
      description: 'No record found for the parent id',
    },

    badRequest: {
      description: 'An UsageError was received',
    },

    serverError: {
      description: 'An unknown error was received',
    },
  },

  fn: async function ({ filter }, exits) {
    const Model = sails.helpers.parse.model(filter.using);

    const attrName = filter.alias;
    if (!attrName || !Model) {
      return exits.serverError();
    }

    // The primary key of the parent record
    const parentPk = filter.criteria.where[Model.primaryKey];

    const matchingRecord = await Model.findOne(parentPk, filter.populates)
      .meta(filter.meta)
      .intercept({ name: 'UsageError' }, (err) => exits.badRequest(err))
      .intercept((err) => exits.serverError(err));

    if (!matchingRecord) {
      sails.log.verbose(
        'In `populate` blueprint action: No parent record found with the specified id (`' +
          parentPk +
          '`).'
      );

      return exits.notFound();
    } //-•

    if (!matchingRecord[attrName]) {
      sails.log.verbose(
        'In `populate` blueprint action: Specified parent record (' +
          parentPk +
          ') does not have a `' +
          attrName +
          '`.'
      );

      return exits.notFound();
    } //-•

    return exits.success(matchingRecord[attrName]);
  },
};
