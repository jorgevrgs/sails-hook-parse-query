module.exports = {
  friendlyName: 'Filter Update',

  description: 'Get the filters to update an object.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Model name',
      example: 'product',
    },

    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
        emailAddress: 'new@email.com',
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function ({ model, params }, exits) {
    let queryOptions = {};
    const Model = sails.helpers.parse.model(model);

    queryOptions.criteria = {
      where: {},
    };

    queryOptions.criteria.where[Model.primaryKey] = params.id;

    // Note that we do NOT set `fetch: true`, because if we do so, some versions
    // of Waterline complain that `fetch` need not be included with .updateOne().
    // (Now that we take advantage of .updateOne() in blueprints, this is a thing.)
    queryOptions.meta = {};

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┬  ┬┌─┐┬  ┬ ┬┌─┐┌─┐
    //  ├─┘├─┤├┬┘└─┐├┤   └┐┌┘├─┤│  │ │├┤ └─┐
    //  ┴  ┴ ┴┴└─└─┘└─┘   └┘ ┴ ┴┴─┘└─┘└─┘└─┘

    queryOptions.valuesToSet = (function getValuesToSet() {
      // Use all of the request params as values for the new record, _except_ `id`.
      let values = _.omit(params, 'id');

      // No matter what, don't allow changing the PK via the update blueprint
      // (you should just drop and re-add the record if that's what you really want)
      if (
        typeof values[Model.primaryKey] !== 'undefined' &&
        values[Model.primaryKey] !==
          queryOptions.criteria.where[Model.primaryKey]
      ) {
        sails.log.warn(
          'Cannot change primary key via update blueprint; ignoring value sent for `' +
            Model.primaryKey +
            '`'
        );
      }
      // Make sure the primary key is unchanged
      values[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];

      return values;
    })();

    return exits.success(queryOptions);
  },
};
