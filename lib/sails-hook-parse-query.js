/**
 * Dependencies
 */
const _ = require('@sailshq/lodash');
const DRY_PACKS_BY_SLUG = require('../accessible/dry');

/**
 * sails-hook-jsonwebtoken
 *
 * @see https://github.com/sailshq/sails-hook-organics
 */

/**
 * Json Web Token JWT hook
 *
 * @param  {SailsApp} sails
 * @return {Dictionary} [hook definition]
 */
module.exports = function (sails) {
  return {
    /**
     * defaults
     *
     * The implicit configuration defaults merged into `sails.config` by this hook.
     *
     * @type {Dictionary}
     */
    defaults: {
      defaultLimit: 30,
      defaultPopulateLimit: 30,
      defaultSort: 'id ASC',
      maxLimit: 100,
    },

    /**
     * configure()
     *
     * @type {Function}
     */
    configure: function () {},

    initialize: function (done) {
      if (!sails.hooks.helpers) {
        return done(
          new Error(
            'Cannot load sails-hook-parse-query without enabling the "helpers" hook!'
          )
        );
      }

      if (!sails.hooks.orm) {
        return done(
          new Error(
            'Cannot load sails-hook-parse-query without enabling the "sails-hook-orm" hook!'
          )
        );
      }

      if (!sails.config.globals._) {
        return done(
          new Error(
            'Cannot load sails-hook-parse-query without enabling the "_" in globals!'
          )
        );
      }

      sails.after('hook:helpers:loaded', function () {
        try {
          _.each(DRY_PACKS_BY_SLUG, (dryPack, slug) => {
            if (!sails.helpers[slug]) {
              sails.hooks.helpers.furnishPack(slug, dryPack);
              return;
            } else {
              _.each(dryPack.defs, (def, identity) => {
                sails.hooks.helpers.furnishHelper(slug + '.' + identity, def);
              }); //∞
            } //ﬁ
          }); //∞
          /////////////////////////////////////////////////////////
        } catch (error) {
          return done(error);
        }

        return done();
      });
    },
  };
};
