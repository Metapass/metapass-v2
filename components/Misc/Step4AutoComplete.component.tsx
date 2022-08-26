import { Box, Flex } from '@chakra-ui/react'
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteGroup,
} from '@choc-ui/chakra-autocomplete'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
const VenueAutoComplete = ({ venueXY, setVenueXY }: any) => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX as string
    const [options, setOptions] = useState([])
    const mapContainerRef = useRef(null)

    const onVenueChange = async (value: string) => {
        const { data }: any = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX}`
        )
        if (data) {
            setOptions(data.features)
        }
    }
    useEffect(() => {
        if (venueXY.name) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current || 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [venueXY.x, venueXY.y], // starting position
                zoom: 8, // starting zoom
            })
            map.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    // When active the map will receive updates to the device's location as it changes.
                    trackUserLocation: true,
                    // Draw an arrow next to the location dot to indicate which direction the device is heading.
                    showUserLocation: true,
                })
            )
            // const markerNode = document.createElement('div')
            // add navigation control (the +/- zoom buttons)

            map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
            const marker = new mapboxgl.Marker() // initialize a new marker
                .setLngLat([venueXY.x, venueXY.y]) // Marker [lng, lat] coordinates
                .addTo(map)

            return () => map.remove()
        }
    }, [venueXY.name])
    return (
        <Flex flexDir={'column'}>
            <Flex
                w="30%"
                h="25vh"
                mt="4"
                pos="absolute"
                justifyContent="center"
            >
                <AutoComplete rollNavigation>
                    <AutoCompleteInput
                        variant="outline"
                        placeholder="What's the location?"
                        onChange={(e) => {
                            onVenueChange(e.target.value)
                        }}
                        autoFocus
                    />

                    <AutoCompleteList maxH="10x">
                        {options &&
                            options.map((option: any, oid) => (
                                <AutoCompleteItem
                                    key={`option-${oid}`}
                                    value={option.place_name}
                                    textTransform="capitalize"
                                    onClick={() =>
                                        setVenueXY({
                                            name: option.place_name,
                                            x: option.center[0],
                                            y: option.center[1],
                                        })
                                    }
                                >
                                    {option.place_name}
                                </AutoCompleteItem>
                            ))}
                    </AutoCompleteList>
                </AutoComplete>
            </Flex>
            {venueXY.name && (
                <Box
                    className="map-container"
                    w="100%"
                    h="25vh"
                    borderRadius="md"
                    mt="20"
                    ref={mapContainerRef}
                ></Box>
            )}
        </Flex>
    )
}

export default VenueAutoComplete
