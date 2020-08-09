import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { updateActivity } from '../../apiHelpers'

export default ({ row, column: { key } }: any) => {
  const checked = row[key];

  const onChange = () => {
    updateActivity(row.doc, {
      [key]: !checked
    });
  }

  return (
    row.id ? <Checkbox onChange={onChange} checked={checked} /> : null
  );
}
