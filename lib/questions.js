module.exports = {
  operationQuestion: {
    type: 'select',
    name: 'operation',
    message: 'Select an operation',
    initial: 0,
    choices: [
      { name: 'sms', message: 'SMS', value: 'sms' },
      { name: 'call', message: 'Call', value: 'call' },
      { name: 'setup', message: 'Setup Twilio Account', value: 'setup' }
    ]
  },

  destinationNumber: lastUsedNumber => ({
    type: 'input',
    name: 'number',
    message: 'Destination number',
    initial: lastUsedNumber
  }),

  smsQuestion: {
    type: 'input',
    name: 'body',
    message: 'Message to send',
    initial: 'test'
  },

  setupQuestion: [
    {
      type: 'input',
      name: 'sid',
      message: 'Account SID',
      initial: 'AC...'
    },
    {
      type: 'password',
      name: 'token',
      message: 'Auth Token'
    },
    {
      type: 'input',
      name: 'phone',
      message: 'Phone number (with country code)',
      initial: '+123456789'
    }
  ]
};
