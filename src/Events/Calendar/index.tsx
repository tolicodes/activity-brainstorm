import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar'

import Event from './Event';
import generateCalendarItems from './generateCalendarItems';

export default ({
  events
}: any) => {
  // @ts-ignore
  const calendarItems = generateCalendarItems(events);

  const localizer = momentLocalizer(moment)

  return (<>
    <Calendar
      localizer={localizer}
      // @ts-ignore
      events={calendarItems}
      popup={true}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      components={{
        event: Event
      }}
    />
  </>);
}