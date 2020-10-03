const nconf = require('nconf');
const {
  getConfig,
  setup,
  getLastUsedNumber,
  updateLastUsedNumber,
} = require('../lib/config');

const enquirer = require('enquirer');

jest.mock('enquirer', () => ({
  prompt: jest.fn(() => 'promptTest'),
}));

const mockEnv = {
  TWILIO_ACCOUNT_SID: 'mockSid',
  TWILIO_AUTH_TOKEN: 'mockToken',
  TWILIO_PHONE_NUMBER: 'mockNumber',
};

let shouldThrowError = false;

nconf.file = jest.fn();
nconf.set = jest.fn((key, newVal) => (mockEnv[key] = newVal));
nconf.save = jest.fn((cb) => (shouldThrowError ? cb('error') : cb()));
nconf.get = jest.fn((key) => {
  return mockEnv[key];
});

describe('getConfig', () => {
  it('should load the configuration from file', () => {
    // Assert
    expect(getConfig()).toEqual([
      mockEnv.TWILIO_ACCOUNT_SID,
      mockEnv.TWILIO_AUTH_TOKEN,
      mockEnv.TWILIO_PHONE_NUMBER,
    ]);
  });

  describe('setup', () => {
    it('should save the configuration to a file ', async () => {
      // Arrange
      shouldThrowError = false;
      const testQuery = 'test';

      // Act
      try {
        await setup(testQuery);
      } catch (err) {
        // Should never go here
        expect(false).toEqual(true);
      }

      // Assert
      expect(enquirer.prompt).toHaveBeenCalledWith(testQuery);
      expect(nconf.save).toHaveBeenCalled();
    });

    it('should throw an error when unable to save the configuration settings', async () => {
      // Arrange
      shouldThrowError = true;
      let errorHasBeenThrowned = false;

      // Act
      try {
        await setup();
      } catch (err) {
        errorHasBeenThrowned = true;
      }

      // Assert
      expect(errorHasBeenThrowned).toEqual(true);
    });
  });

  describe('getLastUsedNumber', () => {
    it('should return undefined when nothing has been saved', () => {
      // Act
      const savedNumber = getLastUsedNumber();

      // Assert
      expect(savedNumber).toBeUndefined();
    });

    it('should return the last used number when present', () => {
      // Arrange
      const expectedNumber = 12345;
      mockEnv['LAST_USED_NUMBER'] = expectedNumber;

      // Act
      const savedNumber = getLastUsedNumber();

      // Assert
      expect(savedNumber).toEqual(expectedNumber);
    });
  });

  describe('updateLastUsedNumber', () => {
    it('should store a specified number to the configuration file', async () => {
      // Arrange
      const newNumber = '0000';
      shouldThrowError = false;

      // Act
      await updateLastUsedNumber(newNumber);

      // Assert
      expect(getLastUsedNumber()).toEqual(newNumber);
    });

    it('should throw an error when unable to save the configuration settings', async () => {
      // Arrange
      shouldThrowError = true;
      let errorHasBeenThrown = false;

      // Act
      try {
        await updateLastUsedNumber(newNumber);
      } catch (err) {
        errorHasBeenThrown = true;
      }

      // Assert
      expect(errorHasBeenThrown).toEqual(true);
    });
  });
});
