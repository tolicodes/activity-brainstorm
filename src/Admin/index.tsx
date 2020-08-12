
import React from 'react';

import DataGrid from './DataGrid';
import Import from './Import';

import {
  EVENT, ACTIVITIES,
} from '../entities';

const currentEntity = EVENT;

export default () => (
  <div>
    <Import
      entity={currentEntity}
    />
    <DataGrid
      entity={currentEntity}
    />
  </div>
)
