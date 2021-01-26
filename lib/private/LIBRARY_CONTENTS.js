/**
 * LIBRARY_CONTENTS
 *
 * @type {Dictionary}
 */

module.exports = {
  parse: {
    description:
      'Process the request query object and return the criteria and populate objects.',
    methodIdts: [
      'limit',
      'model',
      'omit',
      'populate',
      'query',
      'select',
      'skip',
      'sort',
      'where',
    ],
  },
  actions: {
    description: 'Process the result for a database query',
    methodIdts: [
      'add',
      'create',
      'destroy',
      'find',
      'find-one',
      // 'populate',
      // 'remove',
      // 'replace',
      // 'update',
    ],
  },
  filters: {
    description: 'Obtain the filters to process actions',
    methodIdts: [
      'add',
      'create',
      'destroy',
      'find',
      'find-one',
      'populate',
      'remove',
      'replace',
      'update',
    ],
  },
};
