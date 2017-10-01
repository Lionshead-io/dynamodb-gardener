/* eslint comma-dangle: 0 max-len: 0 */
// @flow
/**
 * schemaCheck.js
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { has as _has, isArray as _isArray } from 'lodash';
import chalk from 'chalk';
import Result from 'folktale/result';
import Validation, { Success } from 'folktale/validation';
import { readJSONFile } from '../io/read';
import { isObj } from './schemaCheck';

export const hasProjectName = (file: { TableName: string, Environments: Array<string> }): Validation => {
  return (_has(file, 'ProjectName')) ? Validation.Success() : Validation.Failure([`${chalk.yellow('dynamo-landscaper.config.json')} - Landscaper Config file must have a 'ProjectName' property.`]);
};

export const hasEnvironments = (file: { TableName: string, Environments: Array<string> }): Validation => {
  return (_has(file, 'Environments') && _isArray(file.Environments)) ? Validation.Success() : Validation.Failure([`${chalk.yellow('dynamo-landscaper.config.json')} - Landscaper Config file must have an 'Environments' property of type <Array>.`]);
};

export const hasAppendOrPrepend = (file: { TableName: string, Environments: Array<string>, Append?: boolean, Prepend?: boolean }): Validation => {
  return (_has(file, 'Append') || _has(file.Prepend)) ? Validation.Success() : Validation.Failure([`${chalk.yellow('dynamo-landscaper.config.json')} - Landscaper Config file must have an 'Append' or 'Prepend' property of type <Boolean>.`]);
};

export default function readAndValidateLandscaperConfig(): Validation {
  return Validation.fromResult(readJSONFile(`${process.cwd()}/dynamo-landscaper.config.json`)
    .chain(file => (
      Result.fromValidation(
        Success()
          .concat(isObj(file))
          .concat(hasProjectName(file))
          .concat(hasEnvironments(file))
          .concat(hasAppendOrPrepend(file))
          .map(_ => file)
      ))
    )
    .mapError(err => [err])
  );
}
