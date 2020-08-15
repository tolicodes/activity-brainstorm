import moment from 'moment';
import debugCreator from '../helpers/debug'
import standardFunctions from './standardFunctions';

import NameFormatter from '../Admin/Editors/NameCell';
import Checkbox from '../Admin/Editors/Checkbox';
import Modal from '../Admin/Editors/Modal';

const debug = debugCreator('entities/event/importTransform')

export default {
  ...standardFunctions('events', (collection: any) => collection.orderBy(
    'timeStart',
    'desc'
  )),
  fields: [
    { key: 'title', name: 'Title', editable: true, formatter: NameFormatter, required: true, nameField: true },
    { key: 'activity', name: 'Activity', editable: true, required: true },
    {
      key: 'properties', name: 'Properties', ...Modal, required: true, editorProps: {
        fields: [
          { key: 'remote', name: 'Online Event', ...Checkbox },
          // { key: 'timeStart', name: 'Time Start', editable: true },
          // { key: 'timeEnd', name: 'Time End', editable: true },
          { key: 'recurrence', name: 'Repeats', ...Checkbox },
          // { key: 'recurrenceInterval', name: 'Repeats When?', editable: true },
          // { key: 'url', name: 'URL', editable: true },
          // { key: 'zoomUrl', name: 'Zoom URL', editable: true },
          // { key: 'host', name: 'Host', editable: true },
          // { key: 'cost', name: 'Cost', editable: true },
          // { key: 'detailsHtml', name: 'Details', editable: true }
        ]
      }
    },
  ],
  importTransform: (row: any) => {
    debug('pre-transform', row);

    const transformed = {
      title: row[0],
      activity: 'Improv',
      remote: row[2] === 'TRUE',
      timeStart: moment(row[4]).toDate(),
      timeEnd: row[5] ? moment(row[5]).toDate() : null,
      recurrence: row[6] === 'TRUE',
      recurrenceInterval: row[7],
      url: row[8],
      zoomUrl: row[9],
      host: row[10],
      cost: row[11] === 'FREE' ? 0 : Number(row[11].replace(/[^\d.]/, '')),
      detailsHtml: row[12],
    };

    debug('transformed', transformed);
    return transformed;
  }
}
