---
id: dg:getting-started
title: Getting Started ∙ DynamoDB Gardner/Landscaper
---

# Getting Started

### Step 1. Install dynamodb-landscaper from NPM
For better experience, make sure that you have `npm v3+` installed.

```sh
$ sudo npm install -g dynamodb-landscaper
```

### Step 2. Create a directory that will contain all of your table schemas and seeding data.

In the root of your project directory, run the following command to create an empty directory...

```sh
mkdir dynamodb-migrations
```

### Step 3. Inside of the new directory you just created in Step 2, create a dynamodb-landscaper.config.json file.

> NOTE: the file name MUST be dynamo-landscaper.config.json

```sh
touch dynamo-landscaper.config.json
```

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
