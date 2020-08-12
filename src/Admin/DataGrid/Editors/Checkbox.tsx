import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ row, column: { key }, updateFn }: any) => {
  const checked = row[key];

  const onChange = () => {
    updateFn(row.doc, {
      [key]: !checked
    });
  }

  return (
    row.id ? <Checkbox onChange={onChange} checked={checked} /> : null
  );
}
