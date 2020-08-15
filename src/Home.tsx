import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import ACTIVITY from './entities/activities';
import getThumbnailGridSize from './helpers/getThumbnailGridSize';

export default () => {
  const [activities] = useCollection(ACTIVITY.collection);

  const { cellHeight, cols } = getThumbnailGridSize();

  if (!activities) return null;

  return (<GridList cellHeight={cellHeight} cols={cols}>
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