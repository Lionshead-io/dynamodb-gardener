/* eslint arrow-body-style: 0 max-len: 0 */
// @flow
/**
 * schemaCheck.js
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { isObject as _isObject, has as _has, isArray as _isArray } from 'lodash';
import Validation from 'folktale/validation';

export const isObj = (file: { hash: string, keys: any, items: Array<Object> }): Validation => {
  return (_isObject(file)) ? Validation.Success() : Validation.Failure(['The Table Definition file is not a valid object.']);
};

export const hasHash = (file: { hash: string, keys: any, items: Array<Object> }): Validation => {
  return (file.hash) ? Validation.Success() : Validation.Failure(['The Table Definition file is missing a property titled - "hash".']);
};

export const hasItems = (file: { hash: string, keys: any, items: Array<Object> }): Validation => {
  return (_has(file, 'items') && (_isObject(file.items) || _isArray(file.items))) ? Validation.Success() : Validation.Failure(['The Table Definition file must have a "items" property of type <array>.']);
};

export const hasPartitionKey = (file: { hash: string, keys: any, items: Array<Object> }): Validation => {
  const isValid = (_isObject(file) && Array.isArray(file.keys) && file.keys.length) && file.keys.reduce((acc, currVal) => {
    if (acc === true) return acc;
    else if (currVal.KeyType === 'HASH') return true;

    return acc;
  }, false);
  return (isValid) ? (
    Validation.Success()
  ) : Validation.Failure(['The Table Definition file "keys" property should at the minimum have a partition Key defined.']);
};
