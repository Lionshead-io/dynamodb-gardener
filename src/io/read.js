// @flow
/**
 * read.js - Exports two functions { read, readJSONFile }
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
import fs from 'fs';
import Result from 'folktale/result';
import { IO } from 'monet';

export const read = (file: string): IO => IO(() => fs.readFileSync(`${file}`, 'utf8'));
export default read;

export function readJSONFile(fileName: string): Result {
  return Result.try(() => read(fileName).map(file => JSON.parse(file)).run());
}

export function readDirectory(path: string): Result {
  return Result.try(() => IO(() => fs.readdirSync(`${path}`, 'utf8')).run());
}
