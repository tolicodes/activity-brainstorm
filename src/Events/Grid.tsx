import React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import getThumbnailGridSize from '../helpers/getThumbnailGridSize';
import EventCard from './EventCard';

export default (({ events }: any) => {
  const { cellHeight, cols } = getThumbnailGridSize();

  return (
    <GridList cellHeight={300} cols={cols}>
      {
        events.docs.map((doc: any) => <GridListTile key={doc.id}>
          <EventCard doc={doc} />
        </GridListTile>)
      }
    </GridList>
  )
});