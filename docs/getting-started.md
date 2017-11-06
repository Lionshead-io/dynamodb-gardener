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

> NOTE: the file name MUST be `dynamo-landscaper.config.json`

```sh
$ cd ./dynamodb-migrations
$ touch dynamo-landscaper.config.json
```

### Step 4. Edit the `dynamo-landscaper.config.json` you created in Step 3 to match the following JSON schema.

```
{
  "ProjectName": "<ProjectName>",
  "Environments": ["...", "..."],
  "Append": Boolean
}
```

Example:
```
{
  "ProjectName": "dynamodb-gardener",
  "Environments": ["qa", "test", "prod"],
  "Append": true
}
```

|  Properties  |                                                                                                                                                                       Description                                                                                                                                                                       | Required | Type                                      |
|:------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|-------------------------------------------|
|  ProjectName |                                                                                                               A unique identifier of type 'string'. "vpcId" is the partition key of the DynamoDB Table in which Lionsnet stores all data.                                                                                                               |    yes   | string                                    |
| Environments | An array of strings in which each item represents the name of an environment you want a corresponding DynamoDB table for                                                                                                                                                                                                                                | yes      | Array<string> (ex. ["qa", "test", "prod"]) |
| Append       | If "Append" is set to true. DynamoDB Landscaper/Gardner will provision tables with the Environment appended to the name of the table. For example, if you have a project named "foobar" with a list of the following Environments ["qa", "test", "prod"], the following tables will be provisioned: 1) 'foobar-qa', 2) 'foobar-test', 3) 'foobar-prod'. If set to false, the Environment names will be prepended. | yes      | Boolean                                   |



#### [Next: Start seeding your tables](provision-seed-tables.md)
