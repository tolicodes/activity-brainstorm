import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import Calendar from './Calendar';
import Grid from './Grid';
import EVENT from '../entities/events';

export default () => {
  const [events] = useCollection(EVENT.collection);

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