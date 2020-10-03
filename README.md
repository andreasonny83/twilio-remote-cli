# Twilio Remote CLI

[![npm version](https://badge.fury.io/js/twilio-remote-cli.svg)](https://badge.fury.io/js/twilio-remote-cli)
[![npm](https://img.shields.io/npm/dt/twilio-remote-cli.svg)](https://www.npmjs.com/package/twilio-remote-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasonny83/twilio-remote-cli/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andreasonny83/twilio-remote-cli?targetFile=package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> A remote control for your Twilio API

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/main/img/sms.gif" width="700">

## Prerequisites

The CLI has dependencies that require Node 6 or higher, together with NPM 3 or higher.

You will also need a Twilio account and phone number that can send SMS messages
(you can [sign up for a Twilio account for free here](https://www.twilio.com/try-twilio)).

## Table of Contents
- [Twilio Remote CLI](#twilio-remote-cli)
  - [Prerequisites](#prerequisites)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Install Globally](#install-globally)
    - [Run from npm without installing](#run-from-npm-without-installing)
    - [Install a specific version (Example: 0.0.1)](#install-a-specific-version-example-001)
  - [Usage](#usage)
    - [Options](#options)
        - [`--call`, `-c`](#--call--c)
        - [`--digits`, `-d`](#--digits--d)
        - [`--sms`, `-s`](#--sms--s)
        - [`--message`, `-m`](#--message--m)
  - [Configuration](#configuration)
    - [Sending SMS](#sending-sms)
    - [Making calls](#making-calls)
  - [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

### Install Globally

```sh
npm install -g twilio-remote-cli
```

### Run from npm without installing

```sh
npx twilio-remote-cli
```

### Install a specific version (Example: 0.0.1)

```sh
npm install -g twilio-remote-cli@0.0.1
```

## Usage

```
  $ twilio-remote --help

  Usage
    $ twilio-remote

  Options
    --call,    -c   Perform a call against a given number
    --digits   -d   Send some digits to the number when the call is answered
    --sms,     -s   Deliver an sms to a given number (to be used in combination of --message)
    --message, -m   The message to be delivered to the given number (requires the --sms flag)

  Example
    $ twilio-remote
    $ twilio-remote -c +1234567890
    $ twilio-remote -c +1234567890 -d 123
    $ twilio-remote -s +1234567890 -m Allo!
```

Then just follow the instructions on your terminal.

### Options

##### `--call`, `-c`

Perform a call against a given number

```
$ twilio-remote -c +1234567890
```

##### `--digits`, `-d`

**NOTE** This flag must be used in combination with `--call`

Send some DTMF (Dual-Tone Multi-Frequency Tones) tones to the number when the call is answered.
Have a look at [Twilio Studio Flow](https://www.twilio.com/console/studio/flows/).
Learn more how to use the [Gather Input On Call Twilio Widget from here](https://www.twilio.com/docs/studio/widget-library#gather-input-on-call)

If a certain number requires to enter a code when the call is answered, you can use `twilio-remote` in this way:

```
$ twilio-remote -c +1234567890 -d 123
```

##### `--sms`, `-s`

Deliver an sms to a given number
**NOTE** This flag must be used in combination with `--message`

```
$ twilio-remote -s +1234567890 -m Allo!
```

##### `--message`, `-m`

The message to be delivered to the given number
**NOTE** This flag must be used in combination with `--sms`

```
$ twilio-remote -s +1234567890 -m Allo!
```

## Configuration

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/main/img/config.gif" width="700">

Twilio Remote CLI make uses of the Twilio API by accessing you personal Twilio account.
We need to configure the application with our Twilio credentials. Gather your Twilio Account Sid and Auth Token from the [Twilio console](https://www.twilio.com/console) along with a [Twilio phone number](https://www.twilio.com/console/phone-numbers/incoming) that can send SMS messages.

Run the Twilio Remote CLI with

```sh
twilio-remote
```

Then select the `Setup Twilio Account` option and enter all the required information.

### Sending SMS

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/main/img/sms.gif" width="700">

### Making calls

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/main/img/voice.gif" width="700">

## License

MIT

---

Created with 🦄 by [andreasonny83](https://about.me/andreasonny83)