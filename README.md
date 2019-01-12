# Twilio Remote CLI

[![npm version](https://badge.fury.io/js/twilio-remote-cli.svg)](https://badge.fury.io/js/twilio-remote-cli)
[![npm](https://img.shields.io/npm/dt/twilio-remote-cli.svg)](https://www.npmjs.com/package/twilio-remote-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/andreasonny83/twilio-remote-cli/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andreasonny83/twilio-remote-cli?targetFile=package.json)

> A remote control for your Twilio API

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/master/img/sms.gif" width="700">

## Prerequisites

The CLI has dependencies that require Node 6 or higher, together with NPM 3 or higher.
You will also need a Twilio account and phone number that can send SMS messages (you can [sign up for a Twilio account for free here](https://www.twilio.com/try-twilio)).

## Table of Contents
- [Twilio Remote CLI](#twilio-remote-cli)
  - [Prerequisites](#prerequisites)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Install Globablly](#install-globablly)
    - [Install Specific Version (Example: 0.0.1)](#install-specific-version-example-001)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Sending SMS](#sending-sms)
    - [Making calls](#making-calls)
  - [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

### Install Globablly

```sh
npm install -g twilio-remote-cli
```

### Install Specific Version (Example: 0.0.1)

```sh
npm install -g twilio-remote-cli@0.0.1
```

## Configuration

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/master/img/config.gif" width="700">

Twilio Remote CLI make uses of the Twilio API by accessing you personal Twilio account.
We need to configure the application with our Twilio credentials. Gather your Twilio Account Sid and Auth Token from the [Twilio console](https://www.twilio.com/console) along with a [Twilio phone number](https://www.twilio.com/console/phone-numbers/incoming) that can send SMS messages.

Run the Twilio Remote CLI with

```sh
twilio-remote
```

Then select the `Setup Twilio Account` option and enter all the required information.

## Usage

```sh
twilio-remote
```

Then just follow the instructions on your terminal.

### Sending SMS

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/master/img/sms.gif" width="700">

### Making calls

<img src="https://raw.githubusercontent.com/andreasonny83/twilio-remote-cli/master/img/voice.gif" width="700">

## License

MIT

---

Created with 🦄 by [andreasonny83](https://about.me/andreasonny83)