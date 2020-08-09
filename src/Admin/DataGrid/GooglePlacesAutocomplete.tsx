import React, { useState, useEffect } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import loadMapsApi from "load-google-maps-api";

import { updateActivity } from '../../apiHelpers'
import passThroughEditor from './PassThroughEditor'

loadMapsApi({
  key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  libraries: ['places']
})

interface IState {
  address: string;
  latLng?: google.maps.LatLngLiteral
}

const Formatter = ({ row, column: { key }, isEditor }: any) => {
  const [value, setValue] = useState<IState>(row[key] || {
    address: '',
    latLng: undefined
  });

  const handleChange = (address: string) => {
    setValue({
      address,
      latLng: value.latLng
    });
  }

  const handleSelect = async (address: string) => {
    const geo = await geocodeByAddress(address);
    const latLng = await getLatLng(geo[0]);

    setValue({
      address,
      latLng
    });

    updateActivity(row.doc, {
      [key]: {
        address,
        latLng
      }
    });
  }

  const inputRef = React.createRef();

  useEffect(() => {
    // @ts-ignore
    setTimeout(() => {
      if (isEditor && inputRef.current) {

        // @ts-ignore
        inputRef.current.focus();

        // @ts-ignore
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        // needs the space or it doesn't see the change
        // @ts-ignore
        nativeInputValueSetter.call(inputRef.current, value.address + ' ');

        const ev2 = new Event('input', { bubbles: true });
        // @ts-ignore
        inputRef.current.dispatchEvent(ev2);
      }
    }, 200)
  }, []);

  if (!row.id) return null;

  return (
    <PlacesAutocomplete
      value={value.address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            // @ts-ignore
            ref={inputRef}
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map(suggestion => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default Formatter;

export const Editor = passThroughEditor(Formatter, ({
  column,
  row,
  onCommit
}: any) => {
  const withLocationPrefilled = {
    ...row,
    location: row.location || {
      address: row.name
    },
  };

  return (
    <Formatter row={withLocationPrefilled} column={column} onCommit={onCommit} isEditor={true} />
  );
})