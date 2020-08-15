import React, { useState, useEffect, useRef } from 'react';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import loadMapsApi from "load-google-maps-api";

import getValue from './getValue';

loadMapsApi({
  key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  libraries: ['places']
})

interface IState {
  address: string;
  latLng?: google.maps.LatLngLiteral
}

const Editor = (props: any) => {
  const modelValue = getValue(props, {
    address: '',
    latLng: undefined
  });

  const [value, setValue] = useState<IState>(modelValue);

  // typing in
  const handleChange = (address: string) => {
    setValue({
      address,
      latLng: value.latLng
    });
  }

  // selecting an option
  const handleSelect = async (address: string) => {
    const geo = await geocodeByAddress(address);
    const latLng = await getLatLng(geo[0]);

    const update = {
      address,
      latLng
    };

    setValue(update)

    props.doCommit(update);
  }

  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (value.address && !prefilled) return;

    const nameValue = props.row[props.editorProps.prefillValueKey];

    setPrefilled(true);

    setValue({
      address: nameValue,
      latLng: undefined
    });

    // @ts-ignore
    setTimeout(() => {
      if (!inputRef.current) return;
      // @ts-ignore
      inputRef.current.focus();

      // @ts-ignore
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      // needs the space or it doesn't see the change
      // @ts-ignore
      nativeInputValueSetter.call(inputRef.current, nameValue + ' ');

      const ev2 = new Event('input', { bubbles: true });
      // @ts-ignore
      inputRef.current.dispatchEvent(ev2);
    }, 500)
  }, [prefilled]);

  const inputRef = useRef(null);

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

const Formatter = (props: any) => {
  const { address } = getValue(props, {});

  return (
    <div>{address}</div>
  );
}

export default {
  formatter: Formatter,
  editor: Editor,
  editable: true
};

