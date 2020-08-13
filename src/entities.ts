import moment from 'moment';

import NameFormatter from './Admin/DataGrid/Editors/NameCell';
import AzureImageSearch, { Editor as AzureImageSearchEditor } from './Admin/DataGrid/Editors/AzureImageSearch';
import Checkbox from './Admin/DataGrid/Editors/Checkbox';
import GooglePlacesAutocomplete, { Editor as GooglePlacesAutocompleteEditor } from './Admin/DataGrid/Editors/GooglePlacesAutocomplete';

import { getCollection, createEntity, updateEntity, deleteEntity } from './apiHelpers'
import debug from './helpers/debug';

const standardFns = {
  updateFn: updateEntity,
  deleteFn: deleteEntity,
}

const eventCollection = getCollection('events', {
  orderBy: {
    field: 'timeStart',
    direction: 'desc'
  }
});

const activitiesCollection = getCollection('activities', {
  orderBy: {
    field: 'lastModified',
    direction: 'desc'
  }
});

export const EVENT = {
  ...standardFns,
  collection: eventCollection,
  createFn: (entity: any) => createEntity(eventCollection, entity),
  fields: [
    { key: 'title', name: 'Title', editable: true, formatter: NameFormatter },
    { key: 'activity', name: 'Activity', editable: true },
    { key: 'remote', name: 'Online Event', editable: true, formatter: Checkbox, editor: Checkbox },
    // { key: 'timeStart', name: 'Time Start', editable: true },
    // { key: 'timeEnd', name: 'Time End', editable: true },
    { key: 'recurrence', name: 'Repeats', editable: true, formatter: Checkbox, editor: Checkbox },
    { key: 'recurrenceInterval', name: 'Repeats When?', editable: true },
    { key: 'url', name: 'URL', editable: true },
    { key: 'zoomUrl', name: 'Zoom URL', editable: true },
    { key: 'host', name: 'Host', editable: true },
    { key: 'cost', name: 'Cost', editable: true },
    { key: 'detailsHtml', name: 'Details', editable: true },
  ],
  importTransform: (row: any) => {
    debug('entities/event/importTransform', 'pre-transform', row);

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

    debug('entities/event/importTransform', 'transformed', transformed);
    return transformed;
  }
}

export const ACTIVITIES = {
  ...standardFns,
  collection: activitiesCollection,
  createFn: (entity: any) => createEntity(activitiesCollection, entity),
  fields: [
    { key: "name", name: "Name", editable: true, formatter: NameFormatter },
    { key: "imageUrl", name: "Image", editor: AzureImageSearchEditor, formatter: AzureImageSearch, editable: true },
    { key: "covidFriendly", name: "COVID Friendly", formatter: Checkbox, editor: Checkbox, editable: true },
    { key: "openNow", name: "Open Now", formatter: Checkbox, editor: Checkbox, editable: true },
    { key: "location", name: "Location", formatter: GooglePlacesAutocomplete, editor: GooglePlacesAutocompleteEditor, editable: true },
  ]
}