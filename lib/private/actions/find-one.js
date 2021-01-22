module.exports = {
  friendlyName: 'Find Helper action',

  description: 'Helper to get list and count of a model',

  extendedDescription: `This helper is intended to use in the controller directly
to get list and count objects from the database. i.e.:

  const model = 'product';
  const filter = await sails.helpers.filters.findOne(
    model,
    id: inputs.id,
    _.extend(this.req.query, { where: "{ userId: me.id }" })
  )
    .intercept('invalid', 'badRequest')
    .intercept('modelNotFound', 'notFound');

  const { list, count } = await sails.helpers.actions.
    findOnde(model, filter)
    .intercept('modelNotFound', 'notFound');
`,

  inputs: {
    model: {
      type: 'string',
      required: true,
      example: 'product',
    },

    filter: {
      type: 'ref',
      required: true,
      example: {
        criteria: {},
        populates: {},
      },
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },

    modelNotFound: {
      description: 'The model does not exists.',
    },
  },

  fn: async function (inputs, exits) {
    const url = require('url');

    // Get user inputs
    const model = inputs.model;
    const filter = inputs.filter;

    // Get the model class
    const Model = sails.models[model];
    if (!Model) {
      return exits.modelNotFound();
    }

    // Get list and count values from the Model
    const list = await Model.find(filter.criteria, filter.populates).meta({
      makeLikeModifierCaseInsensitive: true,
    });
    const count = await Model.count(filter.criteria.where).meta({
      makeLikeModifierCaseInsensitive: true,
    });

    // Parse Model.photoId into Model.imageSrc link
    _.each(list, (item) => {
      if (Model.attributes.photoId) {
        if (item.photoId) {
          item.imageSrc = url.resolve(
            sails.config.custom.baseUrl,
            `/api/v1/images/${item.photoId.id}`
          );
        } else {
          item.imageSrc = url.resolve(
            sails.config.custom.baseUrl,
            '/images/not-found-small.png'
          );
        }

        delete item.photoId;
      }
    });

    return exits.success({
      list,
      count,
    });
  },
};
