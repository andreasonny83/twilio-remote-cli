const meow = require('meow');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

module.exports.run = () => {
  // Checks for available update and returns an instance
  updateNotifier({ pkg }).notify();

  meow(
    `
    Usage
      $ twilio-remote
  `,
    {
      flags: {
        version: {
          alias: 'v'
        },
        help: {
          alias: 'h'
        }
      }
    }
  );
};
