WDIO Slick Reporter
==================

> A slick WebdriverIO reporter intended for local development.

![Demo](https://raw.github.com/codeclown/wdio-slick-reporter/gif/demo.gif)

Gif above was recorded with ttystudio and is not the best quality example of this reporter in action. [Here's an example project you can just clone and test to see it in action.](https://github.com/codeclown/wdio-slick-reporter-example)

## Installation

Install [`wdio-slick-reporter`](https://www.npmjs.com/package/wdio-slick-reporter) as a devDependency.

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
