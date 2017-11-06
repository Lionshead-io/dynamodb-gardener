---
id: dg:provision-seed-tables
title: Provision & Seed DynamoDB Tables ∙ DynamoDB Gardner/Landscaper
---

# Provision & Seed DynamoDB Tables

If you are on this page, we are assuming that you've gone ahead and created a 'dynamodb-migrations' directory that
contains a `dynamo-landscaper.config.json` file that adheres to the required schema. If you haven't completed all of the steps
listed on the [Getting Started](getting-started.md) page please go back and complete all of the prerequisite steps.

### How DynamoDB Gardner/Landscaper works

Once you've installed `dynamodb-landscaper` you will be able to execute
```sh
$ dynamodb-landscaper
```
from within the directory that contains your `dynamo-landscaper.config.json` file and all table definition files (We'll cover these table definition files below). When `dynamodb-landscaper` is executed on the command line from within this directory, DynamoDB Gardner/Landscaper will recursively traverse all table definition files in the directory and provision corresponding DynamoDB tables. Remember that DynamoDB Gardner/Landscaper will create a table for all `Environments` you've listed in your `dynamo-landscaper.config.json` file (Ex. 'foobar-dev', 'foobar-qa', 'foobar-prod', etc.).

DynamoDB Gardner/Landscaper is a simple command line utility. It doesn't support command line arguments and has one default action, therefore we have not documented the tools command line use. It is as simple as executing
```sh
$ dynamodb-landscaper
```


### Documentation

* [Getting Started](getting-started.md)
* [Provision and Seed Tables](provision-seed-tables.md)
