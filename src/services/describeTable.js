// @flow
/**
 * describeTable.js - Exports one function
 *
 * read() - function that leverages the IO monad to read files.
 * readJSONFile() - wraps read in a Result.try() data structure to return a Result
 *                  based on the outcome of reading the file
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
