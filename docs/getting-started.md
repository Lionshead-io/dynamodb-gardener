---
id: dg:getting-started
title: Getting Started ∙ DynamoDB Gardner/Landscaper
---

# Getting Started

For better experience, make sure that you have `npm v3+` installed.

```sh
$ sudo npm install -g dynamodb-landscaper
```

### How to Build

Running `npm run build` will compile source files to a distributable format (CommonJS, ES6 and UMD)
ready to be published to NPM from the `dist` folder. See `tools/build.js` for more info.

### How to Test

Run one, or a combination of the following commands to lint and test your code:

* `npm run lint`       — lint the source code with ESLint
* `npm test`           — run unit tests with Mocha
* `npm run test:watch` — run unit tests with Mocha, and watch files for changes
* `npm run test:cover` — run unit tests with code coverage by Istanbul

### How to Update

Down the road you can fetch and merge the recent changes from this repo back into your project:

```sh
$ git checkout master
$ git fetch babel-starter-kit
$ git merge babel-starter-kit/master
$ npm install
```
