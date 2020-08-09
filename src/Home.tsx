import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { activitiesCollection } from './apiHelpers';

export default () => {
  const [activities] = useCollection(
    activitiesCollection
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!activities) return null;

  return (<GridList cellHeight={isMobile ? 150 : 300} cols={isMobile ? 2 : 4}>
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