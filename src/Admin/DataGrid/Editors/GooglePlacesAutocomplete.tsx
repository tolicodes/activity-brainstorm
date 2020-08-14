import React, { useState, useEffect, useRef } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import loadMapsApi from "load-google-maps-api";

import getValue from './getValue';
import updateValue from './updateValue';
import passThroughEditor from './PassThroughEditor'

loadMapsApi({
  key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  libraries: ['places']
})

interface IState {
  address: string;
  latLng?: google.maps.LatLngLiteral
}

const Formatter = (props: any) => {
  const initialValue = getValue(props, {
    address: '',
    latLng: undefined
  });

  const [value, setValue] = useState<IState>(initialValue);

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

    updateValue(props, {
      address,
      latLng
    })
  }

  const [prefilled, setPrefilled] = useState(false);

  const prefillLocation = () => {
    if (prefilled || value.address.trim()) return;

    setValue({
      address: props.row[props.editorProps.prefillValueKey],
      latLng: undefined
    });

    setPrefilled(true);
  }

  const inputRef = useRef(null);

  useEffect(() => {
    if (!prefilled) return;

    // @ts-ignore
    setTimeout(() => {
      if (!inputRef.current) return;
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
    }, 500)
  }, [prefilled, value.address]);

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
            onFocus={prefillLocation}
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

export const Editor = passThroughEditor(Formatter, (props: any) => {
  return (
    <Formatter
      {...props}
      isEditor={true}
    />
  );
})