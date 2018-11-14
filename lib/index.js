const { prompt } = require('enquirer');
const { config, setup } = require('./config');
const { TwilioCC } = require('./twilio-cc');
const questions = require('./questions');

module.exports = Promise.resolve().then(async () => {
  try {
    const operation = await prompt(questions.operationQuestion);

    if (operation.operation == 'setup') {
      await setup(questions.setupQuestion);
      console.log('Twilio Configuration updated');
      process.exit(0);
    }

    const destination = await prompt(questions.destinationNumber);
    const sms = operation.operation == 'sms' && (await prompt(questions.smsQuestion));

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
