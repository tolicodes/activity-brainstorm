import { RRule } from 'rrule'
import moment from 'moment';

const docToCalendarItem = (event: any, calendarItems: any) => {
  const { title, timeStart, timeEnd } = event.data();

  const start = moment.unix(timeStart.seconds).toDate();

  return {
    id: event.id,
    title,
    start,
    end: timeEnd?.seconds ?
      moment.unix(timeEnd.seconds).toDate() :
      moment(start).add('1', 'h').toDate(),
    doc: event,
    // @ts-ignore
    calendarItems,
  };
}

export default (events: any) => {
  // @ts-ignore
  const calendarItems = [];

  events.docs.forEach((doc: any) => {
    // @ts-ignore
    const calendarItem = docToCalendarItem(doc, calendarItems);

    if (!doc.data().recurrence || !doc.data().timeStart.seconds) {
      calendarItems.push(calendarItem)
      return;
    }

    // Create a rule:
    const ruleStartDate = new RRule({
      freq: RRule.WEEKLY,
      count: 100,
      dtstart: calendarItem.start,
    });

    const ruleEndDate = new RRule({
      freq: RRule.WEEKLY,
      count: 100,
      dtstart: calendarItem.end,
    });

    const startDates = ruleStartDate.all();
    const endDates = ruleEndDate.all();

    startDates.forEach((date: any, i: any) => {
      // @todo: how does this happen
      // if (!date) return;

      calendarItems.push({
        ...calendarItem,
        id: `${calendarItem.id}-recurrence-${i}`,
        start: moment(date.toUTCString()).toDate(),
        end: moment(endDates[i].toUTCString()).toDate()
      });
    });
  });

  // @ts-ignore
  return calendarItems;
}