/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  app.log.info("Orbit-btw-bot was loaded!");

  // Load modules
  require('./src/welcome')(app);
  require('./src/commands')(app);
};
