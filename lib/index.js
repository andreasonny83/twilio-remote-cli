const { prompt } = require('enquirer');
const {
  init,
  getConfig,
  setup,
  updateLastUsedNumber,
  getLastUsedNumber
} = require('./config');
const { TwilioCC } = require('./twilio-cc');
const questions = require('./questions');

module.exports.run = () =>
  Promise.resolve().then(async () => {
    try {
      await init();
    } catch (err) {
      console.log(
        'Cannot find a valid Twilio remote configuration.\n' +
          'Please follow the configuration instructions'
      );

      await setup(questions.setupQuestion);
    }

    try {
      const operation = await prompt(questions.operationQuestion);

      if (!operation.operation) {
        return;
      }

      if (operation.operation == 'setup') {
        await setup(questions.setupQuestion);
        console.log('Twilio Configuration updated');
        return;
      }

      const config = getConfig();
      const lastUsedNumber = getLastUsedNumber();
      const destination = await prompt(
        questions.destinationNumber(lastUsedNumber)
      );

      if (!destination.number) {
        return;
      }

      let message;

      if (operation.operation == 'sms') {
        message = await prompt(questions.smsQuestion);
        if (!message.body) {
          return;
        }

        message = message.body;
      }

      // Store last used number for future uses
      await updateLastUsedNumber(destination.number);

      const twiliocc = new TwilioCC(...config);
      const callSid = await twiliocc[operation['operation']].call(
        twiliocc,
        destination.number,
        message
      );

      if (operation.operation === 'call') {
        await twiliocc.getCallStatus(callSid);
        const callOperation = await prompt(questions.callQuestion);

        if (!callOperation.action) {
          return;
        }

        if (callOperation.action == 'drop') {
          await twiliocc.terminateCall(callSid);
        }

        return;
      }
    } catch (err) {
      console.log(err.message || '');
    }
  });
