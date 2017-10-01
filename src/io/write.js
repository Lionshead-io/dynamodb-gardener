// @flow
/**
 * write.js - Exports two functions { write, writeFile }
 *
 * write() - function that leverages the IO monad to write to files in a safe manner.
 * writeFile() - wraps write in a Result.try() data structure to return a Result
 *               based on the outcome of writing to a file
 *
 * Copyright © 2015-2016 Michael Iglesias. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fs from 'fs';
import Result from 'folktale/result';
import { IO } from 'monet';

export const write = (file: string): IO => IO(() => fs.writeFileSync(`${file}`, 'utf8'));

export default write;

export function writeFile(fileContent: any): Result {
  return Result.try(() => write(fileContent).run());
}
