WDIO Slick Reporter
==================

> A slick WebdriverIO reporter intended for local development.

## Installation

Install `wdio-slick-reporter` as a devDependency.

```bash
npm install --save-dev wdio-slick-reporter
```

## Configuration

Use like any other reporter. Setting `logLevel` to `silent` is recommended, otherwise the reporter output will be broken by extraneous logging done by wdio. Example:

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['slick'],
  logLevel: 'silent',
  // ...
};
```

Hint: you can easily use this reporter in local development, but it is not best suited for e.g. CI-environments. You can easily toggle between reporters in the config-file. Example:

```js
  reporters: [process.env.CI ? 'spec' : 'slick'],
  logLevel: process.env.CI ? 'debug' : 'silent',
```

## Development

Run tests:

```bash
$ npm test
```
