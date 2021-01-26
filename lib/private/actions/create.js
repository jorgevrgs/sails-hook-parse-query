module.exports = {
  friendlyName: 'Create Helper action',

  description: 'Create a record in the database.',

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
    conflict: {
      description: 'A duplicate entry was received from adapter',
    },

    badRequest: {
      description:
        'Attempting to create a record that would violate de model validation rules',
    },

    serverError: {
      description: 'A problem in the underlying adapter',
    },
  },

  fn: async function ({ filter }, exits) {
    const Model = sails.helpers.parse.model(filter.using);

    // Get the new record data.
    let data = filter.newRecord;

    // Look for any many-to-one collections that are being set.
    // For example, User.create({pets: [1, 2, 3]}) where `pets` is a collection of `Pet`
    // via an `owner` attribute that is `model: 'user'`.
    // We need to know about these so that, if any of the new children already had parents,
    // those parents get `removedFrom` notifications.

    /*
    const removedFromNotificationsToSend = await _.reduce(
      _.keys(Model.attributes),
      async (memo, attrName) => {
        let response = await memo;

        let attrDef = Model.attributes[attrName];
        if (
          // Does this attribute represent a plural association.
          attrDef.collection &&
          // Is this attribute set with a non-empty array?
          _.isArray(data[attrName]) &&
          data[attrName].length > 0 &&
          // Does this plural association have an inverse attribute on the related model?
          attrDef.via &&
          // Is that inverse attribute a singular association, making this a many-to-one relationship?
          sails.models[attrDef.collection].attributes[attrDef.via].model
        ) {
          // Create an `in` query looking for all child records whose primary keys match
          // those in the array that the new parent's association attribute (e.g. `pets`) is set to.
          let criteria = {};
          criteria[sails.models[attrDef.collection].primaryKey] =
            data[attrName];

          const newChildren = await sails.models[attrDef.collection]
            .find(criteria)
            .intercept((err) => exits.serverError(err));

          // For each child, see if the inverse attribute already has a value, and if so,
          // push a new `removedFrom` notification onto the list of those to send.
          _.each(newChildren, function (child) {
            if (child[attrDef.via]) {
              response.push({
                id: child[attrDef.via],
                removedId: child[sails.models[attrDef.collection].primaryKey],
                attribute: attrName,
              });
            }
          });
        }

        return Promise.resolve(response);
      },
      Promise.resolve([])
    );

    // @TODO: sockets
    sails.log.verbose({ removedFromNotificationsToSend });
    */

    // Create new instance of model using data from params
    const newInstance = await Model.create(data)
      .meta(filter.meta)
      .intercept('E_UNIQUE', 'conflict')
      .intercept('E_INVALID_NEW_RECORD', 'badRequest')
      .intercept(() => exits.serverError());

    // If we didn't fetch the new instance, just return 'OK'.
    if (!newInstance) {
      return exits.success();
    }

    const populatedRecord = await Model.findOne(
      newInstance[Model.primaryKey],
      filter.populates
    ).intercept(() => exits.serverError());

    // Send response
    return exits.success(populatedRecord);
  },
};
