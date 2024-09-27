import React, { useState, useEffect } from 'react';
import Map from '../Map';

export default function Home() {
  const [customerPosition, setCustomerPosition] = useState(null);
  const [deliveryPosition, setDeliveryPosition] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [deliveryPositionIndex, setDeliveryPositionIndex] = useState(0);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  const deliveryRoute = [
    { lat: 18.486058, lng: -69.931212 }, // Parque Independencia
    { lat: 18.471860, lng: -69.892318 }, // Plaza de la Bandera
    { lat: 18.472019, lng: -69.894308 }, // Centro de los Héroes (La Feria)
    { lat: 18.481107, lng: -69.910452 }, // Malecon de Santo Domingo
    { lat: 18.471611, lng: -69.900066 }, // Palacio Nacional
    { lat: 18.476498, lng: -69.940950 }, // Plaza Juan Barón
    { lat: 18.470929, lng: -69.892486 }, // Estadio Quisqueya
    { lat: 18.463667, lng: -69.927706 }, // Zona Colonial (Catedral Primada)
    { lat: 18.452430, lng: -69.945907 }, // Faro a Colón
    { lat: 18.482154, lng: -69.939828 }, // Obelisco Hembra (Malecon)
    { lat: 18.500963, lng: -69.985880 }, // Agora Mall
    { lat: 18.479679, lng: -69.906584 }, // Plaza de la Cultura
    { lat: 18.503607, lng: -69.856282 }, // Megacentro Mall
    { lat: 18.473649, lng: -69.891789 }, // Universidad Autónoma de Santo Domingo (UASD)
  ]
  
  const waypoint1 = { lat: 18.413086316836534, lng: -70.0405020427878 }

  useEffect(() => {
    const interval = setInterval(() => {
      setCustomerPosition(coords)
      setDeliveryPosition(deliveryRoute[deliveryPositionIndex])
      setWaypoints([waypoint1])

      setDeliveryPositionIndex((prevIndex) => (prevIndex === deliveryRoute.length - 1 ? 0 : prevIndex + 1))
    }, 1000);

    return () => clearInterval(interval)
  }, [deliveryRoute, waypoint1])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCoords({ lat: latitude, lng: longitude })
        },
        (err) => {
          setError(err.message);
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [])

  return <Map customerPosition={customerPosition}
    deliveryPosition={deliveryPosition}
    waypoints={waypoints} />
}