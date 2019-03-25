const twilio = require('twilio');
const axios = require('axios');

module.exports.TwilioCC = class TwilioCC {
  constructor(accountSid, authToken, phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.accountSid = accountSid;
    this.authToken = authToken;

    this.client = twilio(accountSid, authToken);
  }

  async sms(to, body) {
    try {
      await this.client.messages.create({
        from: this.phoneNumber,
        to,
        body
      });
    } catch (err) {
      console.log(err);
    }

    console.log('Message sent');
  }

  async call(to) {
    let task;

    try {
      task = await this.client.calls.create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        from: this.phoneNumber,
        to
      });

      if (!(task.status && task.sid)) {
        throw 'Something went wrong. Please try again or check your Twilio credentials.';
      }
    } catch (err) {
      throw err;
    }

    console.log(`Calling ${to}...`);

    return new Promise(res => {
      setTimeout(() => res(task.sid), 500);
    });
  }

  async getCallStatus(callSid) {
    const baseURL = `https://api.twilio.com`;
    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString(
      'base64'
    );

    const callStatusReq = axios.create({
      baseURL,
      timeout: 1500,
      headers: { Authorization: `Basic ${auth}` }
    });

    return new Promise(res => {
      callStatusReq
        .get(`/2010-04-01/Accounts/${this.accountSid}/Calls/${callSid}.json`)
        .then(function(response) {
          if (response.status !== 200) {
            throw 'Server error';
          }

          setTimeout(() => res(), 500);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
          return;
        });
    });
  }

  async terminateCall(callSid) {
    const task = await this.client.calls(callSid);

    return await task.update({ status: 'completed' });
  }
};
