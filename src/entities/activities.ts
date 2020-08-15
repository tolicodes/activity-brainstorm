import standardFunctions from './standardFunctions'

import NameFormatter from '../Admin/Editors/NameCell'
import AzureImageSearch from '../Admin/Editors/AzureImageSearch';
import Checkbox from '../Admin/Editors/Checkbox';
import GooglePlacesAutocomplete from '../Admin/Editors/GooglePlacesAutocomplete';
import Modal from '../Admin/Editors/Modal';

export default {
  ...standardFunctions('activities', (collection: any) =>
    collection.orderBy(
      'lastModified',
      'desc'
    )),
  fields: [
    { key: "name", name: "Name", editable: true, formatter: NameFormatter, nameField: true },
    {
      key: "imageUrl", name: "Image", ...AzureImageSearch,
    },
    {
      key: "properties", name: "Properties", ...Modal, editorProps: {
        // saveValue: false,
        fields: [
          { key: "properties", subKey: "onBeach", name: "On the Beach", ...Checkbox },
          { key: "properties", subKey: "covidFriendly", name: "COVID Friendly", ...Checkbox },
          { key: "properties", subKey: "openNow", name: "Open Now", ...Checkbox },
          { key: "properties", subKey: "fitness", name: "Fitness", ...Checkbox },
          {
            key: "location", name: "Location", ...GooglePlacesAutocomplete, editorProps: {
              prefillValueKey: 'name'
            }
          },
        ]
      }
    },
  ]
}