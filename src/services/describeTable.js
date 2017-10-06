// @flow
/**
 * describeTable.js - Exports describeTable() and describeTableTask (default)
 *
 * describeTable() - describeTable
 * describeTableTask - wraps promise yielding describeTable in a Task data structure
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import AWS from 'aws-sdk';
import { task, of, fromPromised, waitAll } from 'folktale/concurrency/task';
import Result from 'folktale/result';
import { IO } from 'monet';
import Rx from 'rxjs';

const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: process.env.AWS_REGION || 'us-east-1',
});

export const describeTable = (TableName: string): Promise<any> => {
  const params = {
    TableName
  };

  return new Promise((resolve, reject) => {
    dynamodb.describeTable(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
export default fromPromised(describeTable);

export const pollForTableStatus = (TableName: string): any => {
  const T = fromPromised(() => Rx.Observable.fromPromise(describeTable(TableName))
    .map((resp) => {
      if (resp.Table.TableStatus !== 'ACTIVE') {
        throw new Error('Table is still being created.');
      }

      return resp;
    })
    .retryWhen(errors => errors
      // restart in 5 seconds
      .delayWhen(_ => Rx.Observable.timer(15000)) // eslint-disable-line
    )
    .toPromise());

  return T();
};

export async function pollForTableStatus2(TableName: string) {
  const result = await describeTable(TableName);

  if (result.Table.TableStatus === 'ACTIVE') return result;

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 15000);
  });

  return pollForTableStatus2(TableName);
}
