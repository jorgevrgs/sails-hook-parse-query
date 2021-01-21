module.exports = {
  attributes: {
    name: {
      type: 'string',
      description: 'A pet name',
      example: 'Milo',
    },

    user: {
      model: 'user',
    },
  },
};
