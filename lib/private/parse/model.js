module.exports = {
  friendlyName: 'Model',

  description: 'Process model from query string.',

  sync: true,

  inputs: {
    model: {
      type: 'string',
      description: 'Return the Model object from model string',
      required: true,
      example: 'product',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },

    notFound: {
      description: 'The model object does not exist in `sails.models`',
    },
  },

  fn: function (inputs, exits) {
    // Get the model from input.
    const model = inputs.model.toLowerCase();

    // Get the model class.
    const Model = sails.models[model];
    if (!Model) {
      return exits.notFound();
    }

    return exits.success(Model);
  },
};
