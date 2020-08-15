import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import getValue from './getValue';
import debug from '../../helpers/debug';

const Editor = (props: any) => {
  const checked = getValue(props, false);

  const onChange = async (event: any) => {
    const value = event.target.checked;
    debug('Checkbox')('onChange triggered', {
      keyVal: props.keyVal,
      subKey: props.subKey,
      value
    })
    props.doCommit(value)
  }

  return (
    <Checkbox onChange={onChange} checked={checked} />
  );
}

export default {
  editable: true,
  editor: Editor,
  formatter: Editor,
}