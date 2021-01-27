module.exports = {
  friendlyName: 'Filter Populate',

  description: 'Get the filters to populate an association from a model.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      required: true,
      description: 'Model name',
      example: 'cart',
    },

    query: {
      type: 'ref',
      required: true,
      description: 'Request query parameter',
    },

    params: {
      type: 'ref',
      description: 'Request params parameter',
      required: true,
      example: {
        id: 1,
        association: 'product',
      },
    },
  },
  fn: function ({ model, params, query }) {
    if (!params.association) {
      throw new Error('Missing required parameter, `association`.');
    }

    const Model = sails.helpers.parse.model(model);

    const association = _.find(Model.associations, {
      alias: params.association,
    });

    if (!association) {
      throw new Error(
        'Consistency violation: `populate` could not find association `' +
          association +
          '` in model `' +
          Model.globalId +
          '`.'
      );
    }

    let queryOptions = {};

    queryOptions.alias = params.association;

    queryOptions.criteria = {};

    queryOptions.criteria = {
      where: {},
    };

    queryOptions.criteria.where[Model.primaryKey] = params.id;

    queryOptions.populates = {};
    queryOptions.populates[params.association] = {};

    // If this is a to-many association, add a `where` clause.

    if (association.collection) {
      queryOptions.populates[
        params.association
      ].where = sails.helpers.parse.where(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┬  ┌─┐┌─┐┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐├┤ │  ├┤ │   │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘└─┘┴─┘└─┘└─┘ ┴
    if (!_.isUndefined(query.select)) {
      queryOptions.populates[
        params.association
      ].select = sails.helpers.parse.select(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌┬┐┬┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   │ │││││ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘┴ ┴┴ ┴
    else if (!_.isUndefined(query.omit)) {
      queryOptions.populates[
        params.association
      ].omit = sails.helpers.parse.omit(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┬  ┬┌┬┐┬┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   │  │││││ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  ┴─┘┴┴ ┴┴ ┴
    queryOptions.populates[
      params.association
    ].limit = sails.helpers.parse.limit(query);

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┬┌─┬┌─┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐├┴┐│├─┘
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘┴ ┴┴┴
    if (!_.isUndefined(query.skip)) {
      queryOptions.populates[
        params.association
      ].skip = sails.helpers.parse.skip(query);
    }

    //  ┌─┐┌─┐┬─┐┌─┐┌─┐  ┌─┐┌─┐┬─┐┌┬┐
    //  ├─┘├─┤├┬┘└─┐├┤   └─┐│ │├┬┘ │
    //  ┴  ┴ ┴┴└─└─┘└─┘  └─┘└─┘┴└─ ┴
    if (!_.isUndefined(query.sort)) {
      queryOptions.populates[
        params.association
      ].sort = sails.helpers.parse.sort(query);
    }

    // ...
    return queryOptions;
  },
};
