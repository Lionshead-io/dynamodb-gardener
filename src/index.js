// @flow
/**
 * DynamoDB-migrations
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fs from 'fs';
import path from 'path';
import cli from 'commander';
import AWS from 'aws-sdk';
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import chalk from 'chalk';
import Validation from 'folktale/validation';
import logger, { logErrors } from './utils/logger';
import mapFilesToValidation from './validators/mapFilesToValidation';
import readAndValidateLandscaperConfig from './validators/dynamoLandscaperConfig';

const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-1',
});

cli.version('1.0.0')
  .arguments('<none>')
  .parse(process.argv);

console.log(chalk.green(`
╔╦╗┬ ┬┌┐┌┌─┐┌┬┐┌─┐╔╦╗╔╗   ╦  ┌─┐┌┐┌┌┬┐┌─┐┌─┐┌─┐┌─┐┌─┐┬─┐
 ║║└┬┘│││├─┤││││ │ ║║╠╩╗  ║  ├─┤│││ ││└─┐│  ├─┤├─┘├┤ ├┬┘
═╩╝ ┴ ┘└┘┴ ┴┴ ┴└─┘═╩╝╚═╝  ╩═╝┴ ┴┘└┘─┴┘└─┘└─┘┴ ┴┴  └─┘┴└─
`));


// const a = readAndValidateLandscaperConfig().concat(mapFilesToValidation());

const a = Validation.Success()
            .concat(readAndValidateLandscaperConfig())
            .concat(mapFilesToValidation())
            .matchWith({
              Success: () => {
                console.log('sucessful validation');
              },
              Failure: ({ value }) => {
                logErrors(value);
              }
            });

// const a = mapFilesToValidation();
console.log('\n');

// const params = {
//   TableName: 'foobar',
// };
// dynamodb.describeTable(params, (err, data) => {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);
// })


// validateFile('user.json')
//   .map(logger)
//   .chain(file => Result.fromValidation(
//     Success().concat(isObj(file))
//       .concat(hasPartitionKey(file))
//       .concat(hasItems(file))
//       .map(_ => file)
//   ))
//   .matchWith({
//     Ok: ({ value }) => {
//       console.log(value, 'Ok');
//     },
//     Error: ({ value }) => {
//       console.error(value, 'Error');
//     }
//   });
