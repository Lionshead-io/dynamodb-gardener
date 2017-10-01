import fs from 'fs';
import path from 'path';
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import R from 'ramda';
import { mixin as _mixin, isEqual as _isEqual, remove as _remove } from 'lodash';
import Validation, { Success, collect } from 'folktale/validation';
import { isObj, hasPartitionKey, hasItems } from './schemaCheck';
import { isJSONFile } from '../regex/index';
import logger from '../utils/logger';
import read, { readJSONFile } from '../io/read';

_mixin(Array.prototype, {
  flatten: function flatten() {
    return R.flatten(this);
  },
  collectValidations: function collectValidations() {
    return collect(this);
  },
  remove: function remove(item) {
    const nextArr = [].concat(this);
    _remove(this, currVal => _isEqual(currVal, item));

    return nextArr;
  },
});

export const fileToValidation = (filename) => {
  return Validation.fromResult(readJSONFile(filename)
    .chain(file => Result.fromValidation(
      Success().concat(isObj(file))
        .concat(hasPartitionKey(file))
        .concat(hasItems(file))
        .map(_ => file)
    )));
};

export default function mapFilesToValidation(): Validation {
  const readFiles = (accValidations = [], cwd = process.cwd()) => {
    // const content = Result.try(() => fs.readdirSync(`${cwd}`)).getOrElse([]);
    const content = Result.try(() => fs.readdirSync(`${cwd}`)).getOrElse([]);

    // Filter in directories so we can recursively traverse them and validate the files
    // residing within these sub-directories.
    if (content.filter(currVal => !isJSONFile.test(currVal)).length) {
      content.filter(currVal => !isJSONFile.test(currVal))
        .forEach((currVal) => {
          accValidations.push([path.relative(`${process.cwd()}`, `${cwd}/${currVal}`), ...readFiles(undefined, `${cwd}/${currVal}`)]);
        });
    }

    return accValidations.concat(
      content.filter(currVal => ((new RegExp('.json$', 'i')).test(currVal) && currVal !== 'dynamo-landscaper.config.json'))
        .map(currVal => fileToValidation(`${cwd}/${currVal}`)),
    );
  };

  return readFiles()
    .map((currVal) => {
      return (Array.isArray(currVal) ? Maybe.Just(currVal) : Maybe.Nothing())
        .map(val => val.filter(cv => Validation.hasInstance(cv)))
        .map(R.flatten)
        .getOrElse(currVal);
    })
    .flatten()
    .collectValidations();
}
