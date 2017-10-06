// @flow
const DocumentClient = require('dynamodb-promise');

const docClient = DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export default class Dynamo {
  static batchSave(TableName, items): Promise<*> {
    const params = {
      RequestItems: {
        [TableName]: [
          ...items.map(i => ({
            PutRequest: {
              Item: i
            }
          }))
        ]
      }
    };

    return docClient.batchWriteAsync(params);
  }
}
