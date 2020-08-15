import standardFunctions from './standardFunctions'

import NameFormatter from '../Admin/Editors/NameCell';
import AzureImageSearch from '../Admin/Editors/AzureImageSearch';
import Checkbox from '../Admin/Editors/Checkbox';
import GooglePlacesAutocomplete from '../Admin/Editors/GooglePlacesAutocomplete';
import Modal from '../Admin/Editors/Modal';
import Typeahead from '../Admin/Editors/Typeahead';

export default {
  ...standardFunctions('service-providers', (collection: any) =>
    collection.orderBy(
      'lastModified',
      'desc'
    )),
  fields: [
    { key: "name", name: "Name", editable: true, formatter: NameFormatter, nameField: true },
    {
      key: "logoUrl", name: "Logo", ...AzureImageSearch, editorProps: {
        imageKey: 'logoUrl',
        thumbnailKey: 'logoThumbnailUrl',
      }
    },
    {
      key: "location", name: "Location", ...GooglePlacesAutocomplete, editorProps: {
        prefillValueKey: 'name'
      }
    },
    {
      key: "activities", name: "Activities", ...Typeahead, editorProps: {

      },
    },
    {
      key: "properties", name: "Properties", ...Modal, editorProps: {
        fields: [
          { key: "properties", subKey: "onBeach", name: "On the Beach", ...Checkbox },
        ]
      },
    }
  ]
}