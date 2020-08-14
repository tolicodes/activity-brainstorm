import React from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';

import Calendar from './Calendar';
import Grid from './Grid';
import { eventsCollection } from '../apiHelpers';

export default () => {
  const [events] = useCollection(eventsCollection);

  if (!events) return null;

  return (<>
    <Calendar
      events={events}
    />
    <Grid
      events={events}
    />
  </>)
}