import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import EventCard from '../EventCard';


const EventCardWrapper = styled('div')`
  white-space: normal;

  img {
    width: 100%;
  }
`;

const OuterWrap = styled('div')`
  .react-tooltip {
    opacity: 1;
    z-index: 10000;
  }
`;

const TooltipWrapper = styled('div')`
  width: 300px;
  position: relative;

  border: 1px solid gray;
  border-radius: 5px;
  z-index: 100000;
`;

export default ({ event }: any) => {
  const calendarItemId = event.id;
  const eventTooltipId = `event-tooltip-${calendarItemId}`;

  return (
    <OuterWrap>
      <span
        onClick={() => { window.location.href = event.doc.data().url }}
        data-for={eventTooltipId}
        data-tip={calendarItemId}
      >
        {event.title}
      </span>
      <ReactTooltip
        id={eventTooltipId}
        className="react-tooltip"
        backgroundColor="transparent"
        borderColor="transparent"
        getContent={(calendarItemId: any) => {
          if (!calendarItemId) return null;

          return (
            <TooltipWrapper>
              <EventCardWrapper>
                <EventCard
                  doc={
                    event.calendarItems.find(({ id }: any) =>
                      id === calendarItemId
                    ).doc}
                  timeStartOverride={event.start}
                  timeEndOverride={event.end}
                />
              </EventCardWrapper>
            </TooltipWrapper>
          )
        }}
      />
    </OuterWrap>
  )
}