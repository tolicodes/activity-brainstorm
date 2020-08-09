import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import { activitiesCollection } from './apiHelpers';

export default () => {
  const [activities] = useCollection(
    activitiesCollection
  );

  if (!activities) return null;

  return (<GridList cellHeight={300} cols={4}>
    {
      activities.docs.map(doc => {
        const { name, thumbnailUrl } = doc.data();

        return (
          <GridListTile key={thumbnailUrl}>
            <img src={thumbnailUrl} alt={name} />
            <GridListTileBar
              title={name}
              actionIcon={
                <IconButton>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        )
      })
    }
  </GridList>)
}