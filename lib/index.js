const { prompt } = require('enquirer');
const { init, getConfig, setup, updateLastUsedNumber, getLastUsedNumber } = require('./config');
const { TwilioCC } = require('./twilio-cc');
const questions = require('./questions');

module.exports = Promise.resolve().then(async () => {
  try {
    await init();
  } catch(err) {
    await setup(questions.setupQuestion);
  }

  try {
    const operation = await prompt(questions.operationQuestion);

    if (operation.operation == 'setup') {
      await setup(questions.setupQuestion);
      console.log('Twilio Configuration updated');
      process.exit(0);
    }

    const config = getConfig();
    const lastUsedNumber = getLastUsedNumber();
    const destination = await prompt(questions.destinationNumber(lastUsedNumber));
    const sms = operation.operation == 'sms' && (await prompt(questions.smsQuestion));

    // Store last used number for future uses
    await updateLastUsedNumber(destination.number);

    const twiliocc = new TwilioCC(...config);

    await twiliocc[operation['operation']].call(
      twiliocc,
      destination.number,
      sms.body
    );
  } catch (err) {
    throw err.message;
  }
});
