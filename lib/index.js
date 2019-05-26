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

const run = async (options) => {
  try {
    await init();
  } catch (err) {
    console.log(
      'Cannot find a valid Twilio remote configuration.\n' +
        'Please Setup your Twilio account first'
    );

    await setup(questions.setupQuestion);
    return run(options);
  }

  const { input, call, digits, sms, message } = options;
  let operation;
  let destination;
  let messageCopy;

  if (call && input) {
    operation = { operation: 'call' };
    destination = {number: input };
  } else if (input && sms && message) {
    operation = { operation: 'sms' };
    destination = {number: input };
    messageCopy = message;
  } else {
    operation = await prompt(questions.operationQuestion);

    if (!operation.operation) {
      return;
    }

    if (operation.operation == 'setup') {
      await setup(questions.setupQuestion);
      console.log('Twilio Configuration updated');
      return run(options);
    }

    const lastUsedNumber = getLastUsedNumber();
    destination = await prompt(questions.destinationNumber(lastUsedNumber));

    if (!destination.number) {
      return;
    }

    if (operation.operation == 'sms') {
      const messageResponse = await prompt(questions.smsQuestion);
      if (!messageResponse.body) {
        return;
      }

      messageCopy = messageResponse.body;
    }

    // Store last used number for future uses
    await updateLastUsedNumber(destination.number);
  }

  const config = getConfig();
  const twiliocc = new TwilioCC(...config);
  let taskSid;

  if (operation.operation === 'sms') {
    taskSid = await twiliocc.sms(destination.number, messageCopy);
    await twiliocc.getSmsStatus(taskSid);
    return;
  }

  let callStatus;
  callSid = await twiliocc.call(destination.number, digits);

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
};

module.exports.run = run;
