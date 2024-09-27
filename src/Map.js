import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  margin: '1rem',
  width: '100%',
  height: '500px',
};

const center = {
  lat: 18.4737,
  lng: -69.8868,
};

const mapOptions = {
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
}

const Map = ({ customerPosition, deliveryPosition, waypoints }) => {
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null)

  useEffect(() => {
    if (mapRef.current && window.google) {
      const map = mapRef.current;

      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(map);
      }

      const existingMarkers = []
      const addMarker = (position, label, iconUrl = null) => {
        const marker = new window.google.maps.Marker({
          position,
          map,
          icon: {
            url: iconUrl || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            labelOrigin: new window.google.maps.Point(15, -10), 
            scaledSize: new window.google.maps.Size(30, 40), 
          },
          label: {
            text: label,
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'black',
          },
        })
        existingMarkers.push(marker)
      }
      
      if (customerPosition) {
        addMarker(customerPosition, 'You')
      }

      if (deliveryPosition) {
        addMarker(deliveryPosition, 'Delivery')
      }

      waypoints.forEach((waypoint, index) => {
        addMarker(waypoint, `${index + 1}`)
      })

      const directionsService = new window.google.maps.DirectionsService();

      const origin = deliveryPosition || (waypoints.length > 0 ? waypoints[0] : customerPosition);

      directionsService.route(
        {
          origin: origin,
          destination: customerPosition,
          travelMode: window.google.maps.TravelMode.DRIVING,
          waypoints: waypoints.length > 0 ? waypoints.map((point) => ({ location: point })) : [],
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setDirections(result)
          } else {
            console.error(`Error fetching directions ${result}`)
          }
        }
      )

      return () => {
        existingMarkers.forEach(marker => marker.setMap(null));
      }
    }
  }, [customerPosition, deliveryPosition, waypoints])

  return (
    <LoadScript googleMapsApiKey="<GoogleMapsApiKey>"
                libraries={['marker', 'places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        options={mapOptions}
        onLoad={(map) => (mapRef.current = map)}
      />
    </LoadScript>
  )
}

export default Map