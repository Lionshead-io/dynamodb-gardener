import R from 'ramda';
import { isEqual as _isEqual } from 'lodash';
import hasha from 'hasha';
import { readDirectory, readJSONFile } from '../io/read';
import { writeFile } from '../io/write';
import { isJSONFile } from '../regex/index';
import { createTable } from '../services/createTable';
import { pollForTableStatus2 } from '../services/describeTable';
import Dynamo from '../services/Dynamo';
import buildTableName from '../utils/buildTableName';

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

export default TableOperation;
