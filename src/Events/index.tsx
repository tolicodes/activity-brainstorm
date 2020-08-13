import React from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import { eventsCollection } from '../apiHelpers';
import getThumbnailGridSize from '../helpers/getThumbnailGridSize';

import moment from 'moment';

const LinkWrapper = styled('a')`
  height: 100%;

  color: white;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.875rem;
`;

const BottomBarWrapper = styled('div')`
  display: flex;
  width: 100%;

  position: absolute;
  bottom: 0;
`;

const BottomBar = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  flex: 1;

  padding: 16px;

  line-height: 150%;
`

const Date = styled('div')`
  color: #f8f8ff;
  font-size: 12px;
  font-weight: bold;
`

const Title = styled('div')`
  flex: 1;
  font-weight: bold;
`;

const Host = styled('div')`
  font-size: 10px;
`;

const OnlineEvent = styled('div')`
  font-size: 12px;
  background-color: white;
  color: black;
  position: absolute;
  top: 8px;
  left: 8px;
  border-radius: 4px;
  padding: 2px 8px;

  ${({ onlineEvent }: { onlineEvent: boolean }) => !onlineEvent && `
    display: none;
  `}
`;

const Cost = styled('div')`
  font-size: 12px;
  background-color: gray;
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 2px 8px;

  ${({ free }: { free: boolean }) => free && `
    background-color: green;
  `}
`

const DATE_FORMAT = 'ddd, MMM Do';
const TIME_FORMAT = 'h:mm a';

export default () => {
  const [events] = useCollection(eventsCollection);

  const { cellHeight, cols } = getThumbnailGridSize();

  if (!events) return null;

  const THUMBNAIL_URL_TEMP = 'https://storage.googleapis.com/activitybrainstorm.appspot.com/dfb87f8d-d7d1-46b9-a22e-aa5752fb72f5.jpg';
  return (<GridList cellHeight={cellHeight} cols={cols}>
    {
      events.docs.map(doc => {
        const { id, title, remote, host, timeStart, timeEnd, repeats, dayOfWeek, url, zoom, provider, cost, notes, thumbnailUrl } = doc.data();

        const date = `${moment.unix(timeStart.seconds).format(DATE_FORMAT)} ${moment.unix(timeStart.seconds).format(TIME_FORMAT)}`

        return (
          <GridListTile key={id}>
            <img src={THUMBNAIL_URL_TEMP} alt={title} />

            <LinkWrapper href={url}>
              <OnlineEvent onlineEvent={remote}>Online Event</OnlineEvent>
              <Cost free={cost === 0}>{cost === 0 ? 'FREE' : `$${cost}`}</Cost>
              <BottomBarWrapper>
                <BottomBar>
                  <Date>{date}</Date>
                  <Title>{title}</Title>
                  <Host>{host}</Host>
                </BottomBar>
              </BottomBarWrapper>
            </LinkWrapper>
          </GridListTile>
        )
      })
    }
  </GridList>)
}