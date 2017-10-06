// @flow
/**
 * createTable.js - Exports createTable() and createTableTask (default)
 *
 * createTable() - dynamodb.createTable()
 * createTableTask - wraps promise yielding createTable in a Task data structure
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import AWS from 'aws-sdk';
import { fromPromised } from 'folktale/concurrency/task';

const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION || 'us-east-1',
});

export const createTable = (TableName: string, KeySchema: Array<{AttributeName: string, KeyType: string}>, AttributeDefinitions: Array<{AttributeName: string, AttributeType: string}>, ProvisionedThroughput: { ReadCapacityUnits: number, WriteCapacityUnits: number } = { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }): Promise<any> => { // eslint-disable-line
  const params = {
    TableName,
    KeySchema,
    AttributeDefinitions,
    ProvisionedThroughput
  };

  return new Promise((resolve, reject) => {
    dynamodb.createTable(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export default fromPromised(createTable);
