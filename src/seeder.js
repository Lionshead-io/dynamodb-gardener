import R from 'ramda';
import { isEqual as _isEqual } from 'lodash';
import hasha from 'hasha';
import { readDirectory, readJSONFile } from './io/read';
import { writeFile } from './io/write';
import { isJSONFile } from './regex/index';
import { createTable } from './services/createTable';
import { pollForTableStatus2 } from './services/describeTable';
import Dynamo from './services/Dynamo';
import buildTableName from './utils/buildTableName';

const union = require('folktale/adt/union/union');

const TableOperation = union('TableOperation', {
  CreateAndWrite(value) {
    const TableName = value.TableName;
    const KeySchema = value.TableFile.keys;
    const AttributeDefinitions = value.TableFile.AttributeDefinitions;
    const ProvisionedThroughput = value.TableFile.ProvisionedThroughput;
    const items = (function (i) {
      if (Array.isArray(i)) return i;
      else if (Array.isArray(i[value.Environment])) return i[value.Environment];

      return i;
    }(value.TableFile.items));

    return {
      getValue: R.pipeP(
        () => createTable(TableName, KeySchema, AttributeDefinitions, ProvisionedThroughput), // eslint-disable-line
        () => pollForTableStatus2(value.TableName),
        () => Dynamo.batchSave(TableName, items),
      ),
    };
  },
  UpdateSchemaAndWrite(value) {
    const TableName = value.TableName;
    const items = value.TableFile.items;

    return {
      getValue: R.pipeP(
        // TODO: Update Table Schema call goes here.
        () => pollForTableStatus2(value.TableName),
        () => Dynamo.batchSave(TableName, items),
      ),
    };
  },
  Write(value) {
    return {
      vetValue: R.pipeP(
        () => Dynamo.batchSave(value.TableName, value.items),
      ),
    };
  },
  None() {
    return {};
  },
});

async function seeder() {
  const [LandscaperConfig, baseFiles] = readJSONFile(`${process.cwd()}/dynamo-landscaper.config.json`)
                                            .chain(configResult => readDirectory(`${process.cwd()}`).map(dirResult => [configResult, dirResult]))
                                            .getOrElse([{}, []]);

  await (async function worker(Environments) {
    if (Environments.length === 0) return;

    baseFiles.filter(currVal => (isJSONFile.test(currVal) && currVal !== 'dynamo-landscaper.config.json'))
      .forEach(async (currVal) => {
        const TableName = buildTableName(LandscaperConfig.ProjectName, currVal.split('.')[0], Environments[0]);
        const TableFile = readJSONFile(`${process.cwd()}/${currVal}`).getOrElse({});

        // Determine the type of data modelling required per file
        // 1. Check to see if table JSON file has a hash
        //    - If hash is present, hash the 'keys' property and compare it to hash.keys to determine
        //          if a GSI(s) has to be added to the table.
        //    - If hash is present, hash the 'items' property and compare it to hash.items to
        //          determine if any putItem requests must occur.
        //
        // 2. If no hash is present immediately cast to TableOperation.CreateAndWrite
        const action = (function getAction() {
          const payload = Object.assign({}, {
            TableName,
            TableFile,
            LandscaperConfig,
            Environment: Environments[0],
          });

          if (!TableFile.hash) return TableOperation.CreateAndWrite(payload);
          else if ( !_isEqual(TableFile.hash.keys, hasha(JSON.stringify(TableFile.keys))) && !_isEqual(TableFile.hash.items, hasha(JSON.stringify(TableFile.items))) ) { // eslint-disable-line
            return TableOperation.UpdateSchemaAndWrite(payload);
          } else if ( !_isEqual(TableFile.hash.items, hasha(JSON.stringify(TableFile.items))) ) { //eslint-disable-line
            return TableOperation.Write(payload);
          }

          return TableOperation.None();
        }());

        await action.matchWith({
          CreateAndWrite: async ({ getValue }) => {
            await getValue();

            const nextTableFile = Object.assign({}, TableFile, {
              hash: {
                keys: hasha(JSON.stringify(TableFile.keys)),
                items: hasha(JSON.stringify(TableFile.items)),
                ...((TableFile.GlobalSecondaryIndexUpdates) ? { GlobalSecondaryIndexUpdates: hasha(JSON.stringify(TableFile.GlobalSecondaryIndexUpdates)) } : {}) // eslint-disable-line
              },
            });
            writeFile(`${process.cwd()}/${currVal}`, JSON.stringify(nextTableFile));

            return nextTableFile;
          },
          UpdateSchemaAndWrite: async ({ getValue }) => {
            await getValue();

            const nextTableFile = Object.assign({}, TableFile, {
              hash: {
                keys: hasha(JSON.stringify(TableFile.keys)),
                items: hasha(JSON.stringify(TableFile.items)),
                ...((TableFile.GlobalSecondaryIndexUpdates) ? { GlobalSecondaryIndexUpdates: hasha(JSON.stringify(TableFile.GlobalSecondaryIndexUpdates)) } : {}) // eslint-disable-line
              },
            });
            writeFile(`${process.cwd()}/${currVal}`, JSON.stringify(nextTableFile));

            return nextTableFile;
          },
          Write: async ({ getValue }) => {
            await getValue();

            const nextTableFile = Object.assign({}, TableFile, {
              hash: {
                items: hasha(JSON.stringify(TableFile.items)),
              },
            });
            writeFile(`${process.cwd()}/${currVal}`, JSON.stringify(nextTableFile));

            return nextTableFile;
          },
          None: () => Promise.resolve(),
        });
      });

    return worker(Environments.splice(0, 1) && Environments) // eslint-disable-line
  }(LandscaperConfig.Environments || ['prod']));
}

export default seeder;
