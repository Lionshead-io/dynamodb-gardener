export default function (ProjectName: string, TableName: string, environment: string = 'prod', prependOrAppend: string = 'append') {
  return `${prependOrAppend === 'prepend' ? `${environment}-` : ''}${ProjectName}-${TableName}${prependOrAppend === 'append' ? `-${environment}` : ''}`;
}
