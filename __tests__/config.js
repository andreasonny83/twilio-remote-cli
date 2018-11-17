const nconf = require('nconf');
const { prompt } = require('enquirer');

const mockEnv = {
  TWILIO_ACCOUNT_SID: 'mockSid',
  TWILIO_AUTH_TOKEN: 'mockToken',
  TWILIO_PHONE_NUMBER: 'mockNumber'
};

let shouldThrowError = false;

nconf.file = jest.fn();
nconf.save = jest.fn(cb => shouldThrowError ? cb('error') : cb());
nconf.get = jest.fn((key) => {
  return mockEnv[key]
});

describe('Config', () => {
  it('should load the configuration from file', () => {
    // Act
    const config = require('../lib/config');

    // Assert
    expect(config.config).toEqual([
      mockEnv.TWILIO_ACCOUNT_SID,
      mockEnv.TWILIO_AUTH_TOKEN,
      mockEnv.TWILIO_PHONE_NUMBER
    ]);
  });

  it('should save the configuration to a file ', async () => {
    // Arrange
    const { setup } = require('../lib/config');
    shouldThrowError = false;

    // Act
    await setup();

    // Assert
    expect(nconf.save).toHaveBeenCalled();
  });

  it('should throw an error ', async () => {
    // Arrange
    const { setup } = require('../lib/config');
    shouldThrowError = true;
    let errorHasBeenThrowned = false;

    // Act
    try {
      await setup();
    }
    catch(err) {
      errorHasBeenThrowned = true;
    }

    // Assert
    expect(errorHasBeenThrowned).toEqual(true);
  });
});
