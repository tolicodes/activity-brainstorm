
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import DataGrid from './DataGrid';
import Import from './Import';

import ENTITIES from '../entities'

export default () => {
  const [currentEntity, setCurrentEntity] = useState(ENTITIES[0]);
  return (
    <div>
      <div>
        <div>Choose an entity to edit:</div>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          {ENTITIES.map((entity: any) => {
            return (
              <Button
                key={entity.name}
                color={currentEntity === entity ? 'primary' : 'default'}
                onClick={() => setCurrentEntity(entity)}
              >
                {entity.name}
              </Button>
            )
          })}
        </ButtonGroup>
      </div>

      <Import
        entity={currentEntity}
      />
      <DataGrid
        entity={currentEntity}
      />
    </div>
  )
}