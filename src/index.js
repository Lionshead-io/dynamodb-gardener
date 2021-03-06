// @flow
/**
 * DynamoDB-migrations
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import cli from 'commander';
import chalk from 'chalk';
import Validation from 'folktale/validation';
import logger, { logErrors } from './utils/logger';
import mapFilesToValidation from './validators/mapFilesToValidation';
import readAndValidateLandscaperConfig from './validators/dynamoLandscaperConfig';
import seeder from './seeder';

cli.version('1.0.0')
  .arguments('<none>')
  .parse(process.argv);

console.log(chalk.green(`
╔╦╗┬ ┬┌┐┌┌─┐┌┬┐┌─┐╔╦╗╔╗   ╦  ┌─┐┌┐┌┌┬┐┌─┐┌─┐┌─┐┌─┐┌─┐┬─┐
 ║║└┬┘│││├─┤││││ │ ║║╠╩╗  ║  ├─┤│││ ││└─┐│  ├─┤├─┘├┤ ├┬┘
═╩╝ ┴ ┘└┘┴ ┴┴ ┴└─┘═╩╝╚═╝  ╩═╝┴ ┴┘└┘─┴┘└─┘└─┘┴ ┴┴  └─┘┴└─
`));

Validation.Success()
            .concat(readAndValidateLandscaperConfig())
            .concat(mapFilesToValidation())
            .matchWith({
              Success: () => {
                console.log(chalk.yellow('Seeding Tables...'));
                seeder();
              },
              Failure: ({ value }) => {
                logErrors(value);
              },
            });
