const nconf = require('nconf');
const { prompt } = require('enquirer');

const TWILIO_CONFIG = `${process.env.HOME}/.twilio-remote.json`;

nconf.file({ file: TWILIO_CONFIG }).argv();

const TWILIO_ACCOUNT_SID = nconf.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = nconf.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = nconf.get('TWILIO_PHONE_NUMBER');

const config = [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER];

const setup = async setupQuestion => {
  const operation = await prompt(setupQuestion);

  nconf.set('TWILIO_ACCOUNT_SID', operation.sid);
  nconf.set('TWILIO_AUTH_TOKEN', operation.token);
  nconf.set('TWILIO_PHONE_NUMBER', operation.phone);

  return new Promise(res => {
    nconf.save(err => {
      if (err) {
        throw new Error('Cannot save the configuration');
      }

      return res();
    });
  });
};

module.exports = {
  config,
  setup
};
