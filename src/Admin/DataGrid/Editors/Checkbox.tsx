import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import updateValue from './updateValue';
import getValue from './getValue';

export default (props: any) => {
  const checked = getValue(props, false);

  console.log(checked);

  const onChange = async (event: any) => {
    console.log(event.target.checked)
    updateValue(props, event.target.checked)
  }

  return (
    <Checkbox onChange={onChange} checked={checked} />
  );
}
