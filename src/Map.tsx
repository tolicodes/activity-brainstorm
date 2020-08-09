import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import styled from 'styled-components';

import { activitiesCollection } from './apiHelpers';

const DEFAULT_ZOOM = 7;

const Popup = styled('div')`
  background-color: white;
  padding: 10px;
  width: 300px;
  position: absolute;
  z-index: 10000;
`;

const MarkerContainer = styled('div')`
  margin-left: -7px;
  margin-top: -20px;
`;

const Marker = ({
  data
}: any) => {
  const [popup, setPopup] = useState(false);
  return (
    <MarkerContainer>
      <LocationOnIcon
        onMouseOver={() => setPopup(true)}
        onMouseOut={() => setPopup(false)}
      />
      {
        popup && (
          <Popup>
            <h1>{data.name}</h1>
            <div>{data.location.address}</div>
            <div><img width="100%" alt={data.name} src={data.thumbnailUrl} /></div>
          </Popup>
        )
      }
    </MarkerContainer>
  );
}

export default () => {
  const [center, setCenter] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCenter({
        // @ts-ignore
        lat: latitude,
        lng: longitude
      })
    });
  });

  const [activities] = useCollection(
    activitiesCollection
  );

  if (!activities) return null;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        defaultCenter={center}
        defaultZoom={DEFAULT_ZOOM}
      >
        {
          activities.docs.filter((doc: any) => doc.data().location).map(doc => {
            const { location: { latLng: { lat, lng } }, name, id } = doc.data();

            return <Marker
              key={id}
              // @ts-ignore
              lat={lat}
              lng={lng}
              text={name}
              data={doc.data()}
            />
          })
        }

      </GoogleMapReact>
    </div>
  )
}