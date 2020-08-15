import React, { useState } from 'react';
import styled from 'styled-components';

import debugCreator from '../../helpers/debug';

const debug = debugCreator('admin/import')

const Textarea = styled('textarea')`
  width: 100%;
  height: 200px;
`;

export default ({
  entity: {
    createFn,
    fields,
    importTransform,
  }
}: {
  entity: {
    createFn: (entity: any) => any;
    fields: any,
    importTransform?: any
  }
}) => {
  const fieldKeys = fields.map(({ key }: any) => key);
  const [importText, setImportText] = useState('');

  debug('importText', importText);
  const importEntities = () => {
    importText.split('\n').forEach(entity => {
      debug('Entity String', entity);
      const entityValues = entity.split('\t');
      debug('Entity Values Array', entityValues)

      const entityObj = importTransform ?
        importTransform(entityValues) :
        // @ts-ignore
        fieldKeys.reduce((out, fieldKey, i) => {
          out[fieldKey] = entityValues[i];
          return out;
        }, {} as { [key: string]: any })

      createFn(entityObj);
    });
  }

  return (
    <div>
      <Textarea onChange={(event) => setImportText(event.target.value)}></Textarea>
      <input type="submit" onClick={importEntities} />
    </div>
  )
}