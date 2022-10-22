import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Event } from '../../types/Event.type';
import mapboxgl from 'mapbox-gl';
interface Props {
  event: Event;
  isMapCompatible: any;
  setIsMapCompatible: any;
  mapContainerRef: any;
}
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX as string;
function MapComponent({
  event,
  isMapCompatible,
  mapContainerRef,
  setIsMapCompatible,
}: Props) {
  useEffect(() => {
    try {
      if (
        event &&
        event.venue &&
        event.venue.x &&
        event.venue.y &&
        mapContainerRef.current
      ) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current, // container ID
          style: 'mapbox://styles/mapbox/streets-v11', // style URL
          center: [event.venue.x, event.venue.y], // starting position
          zoom: 15, // starting zoom
        });

        // const markerNode = document.createElement('div')
        // add navigation control (the +/- zoom buttons)

        if (map) {
          map.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              // When active the map will receive updates to the device's location as it changes.
              trackUserLocation: false,

              // Draw an arrow next to the location dot to indicate which direction the device is heading.
              showUserLocation: false,
            }),
          );
          map.addControl(
            new mapboxgl.NavigationControl({
              showCompass: false,
              showZoom: false,
              visualizePitch: true,
            }),
            'bottom-left',
          );

          return () => map.remove();
        }
      }
    } catch (error) {
      setIsMapCompatible(false);
    }
  }, [event?.venue]);
  return isMapCompatible ? (
    <Box
      className='map-container'
      w='100%'
      h={{ base: '20vh', md: '10vh' }}
      borderRadius='lg'
      ref={mapContainerRef}
    ></Box>
  ) : (
    <Box
      w='100%'
      h='10vh'
      borderRadius='lg'
      bgImage='https://res.cloudinary.com/dev-connect/image/upload/v1664118651/img/Screenshot_2022-09-25_at_8.34.45_PM_noeivg.png'
      bgSize='cover'
      bgRepeat='no-repeat'
    ></Box>
  );
}

export default MapComponent;
