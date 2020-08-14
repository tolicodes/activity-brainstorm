import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const LinkWrapper = styled('a')`
  display: block;
  height: 100%;

  color: white;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.875rem;
`;

const BottomBarWrapper = styled('div')`
  width: 100%;
  display: flex;  
  position: absolute;
  bottom: 0;

  border: 1px solid black;
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
  font-weight: bold;
  word-wrap: break-word; 
  overflow-wrap: anywhere;
  overflow: hidden;
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
`;

const DATE_FORMAT = 'ddd, MMM Do';
const TIME_FORMAT = 'h:mm a';

const THUMBNAIL_URL_TEMP = 'https://storage.googleapis.com/activitybrainstorm.appspot.com/dfb87f8d-d7d1-46b9-a22e-aa5752fb72f5.jpg';

export default ({ doc, timeStartOverride, timeEndOverride, }: any) => {
  const { id, title, remote, host, timeStart, timeEnd, repeats, dayOfWeek, url, zoom, provider, cost, notes, thumbnailUrl } = doc.data();
  const useTime = moment(timeStartOverride) || moment.unix(timeStart.seconds);

  const date = `${useTime.format(DATE_FORMAT)} ${useTime.format(TIME_FORMAT)}`

  return (
    <>
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
    </>
  )
}