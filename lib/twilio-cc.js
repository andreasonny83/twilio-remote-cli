const twilio = require('twilio');
const chalk = require('chalk');
const ora = require('ora');

module.exports.TwilioCC = class TwilioCC {
  constructor(accountSid, authToken, phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.accountSid = accountSid;
    this.authToken = authToken;

    this.client = twilio(accountSid, authToken);
  }

  async sms(to, body) {
    let message;

    message = await this.client.messages.create({
      from: this.phoneNumber,
      to,
      body
    });

    return message.sid;
  }

  async call(to, digits) {
    let task;

    task = await this.client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      from: this.phoneNumber,
      to,
      sendDigits: digits
    });

    if (!(task.status && task.sid)) {
      throw 'Something went wrong. Please try again or check your Twilio credentials.';
    }

    return task.sid;
  }

  async getSmsStatus(taskId) {
    const message = await this.client.messages(taskId).fetch();
    const copy = `${chalk.cyan('Sending message to:')} ${message.to}...`;
    const spinner = ora(copy);

    spinner.start();
    return new Promise(res => this.checkDelivery(taskId, res, spinner, copy));
  }

  checkDelivery(taskSid, res, spinner, copy) {
    const loop = async () => {
      const sms = await this.client.messages(taskSid).fetch();

      setTimeout(() => {
        spinner.text = `${copy}\nStatus: ${sms.status}`;
        if (sms.status === 'delivered') {
          spinner.clear();
          return res();
        }

        return loop();
      }, 1000);
    };
    return loop();
  }

  async dropCall(callSid) {
    const callTask = await this.client.calls(callSid);

    return callTask.update({
      status: 'completed'
    });
  }

  async keepCallingLoop(callSid) {
    const taskDetails = await this.client.calls(callSid).fetch();
    const callStatus = taskDetails.status;
    const completedStatus = ['canceled', 'completed', 'failed'];
    const callMessage = `Calling ${taskDetails.to}`;

    if (callStatus === 'queued') {
      return `${callMessage}...`;
    }

    if (completedStatus.includes(callStatus)) {
      return false;
    }

    if (callStatus !== 'queued') {
      return `${callMessage}: ${callStatus}`;
    }
  }
};
