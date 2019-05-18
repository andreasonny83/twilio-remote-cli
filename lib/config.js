const fs = require('fs');
const nconf = require('nconf');
const { prompt } = require('enquirer');

const TWILIO_CONFIG = `${process.env.HOME}/.twilio-remote.json`;

const getConfig = () => {
  const TWILIO_ACCOUNT_SID = nconf.get('TWILIO_ACCOUNT_SID');
  const TWILIO_AUTH_TOKEN = nconf.get('TWILIO_AUTH_TOKEN');
  const TWILIO_PHONE_NUMBER = nconf.get('TWILIO_PHONE_NUMBER');

  return [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER];
};

const init = async () => {
  let fileStat;

  try {
    fileStat = fs.lstatSync(TWILIO_CONFIG);
  } catch (err) {
    throw 'Missing configuration file';
  }

  if (fileStat.isFile() && fileStat.size) {
    nconf.file({ file: TWILIO_CONFIG });
    return;
  }

  fs.unlink(TWILIO_CONFIG, () => {
    nconf.file({ file: TWILIO_CONFIG });
    return;
  });

  throw new Error();
};

const setup = async setupQuestion => {
  nconf.file({ file: TWILIO_CONFIG });

  const operation = await prompt(setupQuestion);
  const { sid, token, phone } = operation;

  if (!Object.keys(operation).length) {
    throw new Error('Failed. ❌\nWrong Twilio account information provided');
  }

  nconf.set('TWILIO_ACCOUNT_SID', sid);
  nconf.set('TWILIO_AUTH_TOKEN', token);
  nconf.set('TWILIO_PHONE_NUMBER', phone);

  return new Promise(res => {
    nconf.save(err => {
      if (err) {
        throw new Error('Cannot save the configuration');
      }

      res();
    });
  });
};

const updateLastUsedNumber = async newNumber => {
  if (!newNumber) {
    return;
  }

  nconf.set('LAST_USED_NUMBER', newNumber);

  return new Promise(res => {
    nconf.save(err => {
      if (err) {
        throw new Error('Cannot save the configuration');
      }

      res();
    });
  });
};

const getLastUsedNumber = () => nconf.get('LAST_USED_NUMBER');

module.exports = {
  init,
  getConfig,
  setup,
  updateLastUsedNumber,
  getLastUsedNumber
};
