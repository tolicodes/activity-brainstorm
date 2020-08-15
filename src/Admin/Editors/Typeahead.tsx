import React, { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { v4 as uuid } from 'uuid';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import getValue from './getValue';

const Editor = (props: any) => {
  const initialValue = getValue(props, []);
  const [selected, setSelected] = useState(initialValue);

  useEffect(() => {
    setSelected(initialValue)
  }, [initialValue])

  const onChange = (selected: any) => {
    setSelected(selected);
    props.save(selected);
  }

  const options = ['a', 'b', 'c']

  return (
    <>
      <Typeahead
        id={uuid()}
        multiple
        onChange={onChange}
        options={options}
        placeholder="Start typing for suggestions"
        selected={selected}
      />
    </>
  );
}

const Formatter = (props: any) => {
  const vals = getValue(props, []);

  return (
    <div>{vals.join(', ')}</div>
  );
}

export default {
  editor: Editor,
  formatter: Formatter,
  editable: true,
}