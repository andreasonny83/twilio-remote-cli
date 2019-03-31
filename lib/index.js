const { prompt, Select } = require('enquirer');
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
      let taskSid;

      if (operation.operation === 'sms') {
        taskSid = await twiliocc.sms(destination.number, message);
        await twiliocc.getSmsStatus(taskSid);
        return;
      }

      let callStatus;
      callSid = await twiliocc.call(destination.number);

      const promptInput = new Select({
        name: 'dropCall',
        choices: ['Drop call'],
        separator: () => '',
        header: () => callStatus,
        message: state =>
          state.submitted
            ? 'Call ended'
            : `Press return to end the call once you're done.`
      });

      promptInput
        .once('close', () => promptInput.clear())
        .once('run', () => {
          setInterval(async () => {
            const call = await twiliocc.keepCallingLoop(callSid);

            if (!call) {
              promptInput.cancel();
            }

            callStatus = call;
            promptInput.render();
          }, 500);
        });

      await promptInput.run();
      await twiliocc.dropCall(callSid);
    } catch (err) {
      console.log(err.message || '');
    }
  });
