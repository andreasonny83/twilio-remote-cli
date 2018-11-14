const twilio = require('twilio');

module.exports.TwilioCC = class TwilioCC {
  constructor(AccountSid, authToken, phoneNumber) {
    this.phoneNumber = phoneNumber;

    this.client = twilio(AccountSid, authToken);
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
    try {
      await this.client.calls
        .create({
          url: 'http://demo.twilio.com/docs/voice.xml',
          from: this.phoneNumber,
          to
        })
    } catch (err) {
      return err;
    }

    console.log(`Calling ${to}`);
  }
};
