module.exports = {
  attributes: {
    emailAddress: {
      type: 'string',
      description: 'The email address for this user.',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com',
    },

    password: {
      type: 'string',
      description:
        "Securely hashed representation of the user's login password.",
      protect: true,
      example: '2$28a8eabna301089103-13948134nad',
    },
  },
};
