// @flow
/**
 * logger.js
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import R from 'ramda';
import _ from 'lodash';
import chalk from 'chalk';

const logger = R.tap(msg => console.log(msg))
export default logger;

export const logErrors = (errors: Array<string>): void => {
  console.error(chalk.red.bold('Errors:', '\n', '--------------------------------------------------------', '\n'));
  _(errors).flatten().forEach(currVal => console.error(`  * ${chalk.red(currVal)}`));
};
