import React, { useState } from 'react';
import styled from 'styled-components';

import { createActivity } from '../apiHelpers'

const Textarea = styled('textarea')`
  width: 100%;
  height: 200px;
`;

export default () => {
  const [activityImport, setActivityImport] = useState('');

  const importActivities = () => {
    activityImport.split('\n').forEach(activity => {
      createActivity({
        name: activity
      });
    });
  }

  return (
    <div>
      <Textarea onChange={(event) => setActivityImport(event.target.value)}></Textarea>
      <input type="submit" onClick={importActivities} />
    </div>
  )
}