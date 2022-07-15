import { Box, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'

import { Event } from '../../types/Event.type'
import { useEffect, useState } from 'react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import EventLayout from '../../layouts/Event/Event.layout'
import { Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { getEvents } from '../../utils/helpers/getEvent'
import { parseEvent } from '../../utils/helpers/parseEvent'

const Event: NextPage = () => {
    const router = useRouter()
    const { address } = router.query

    const [featEvent, setFeatEvent] = useState<Event>({
        id: '',
        title: '',
        childAddress: '',
        category: {
            event_type: '',
            category: [''],
        },
        image: {
            image: '',
            gallery: [],
            video: '',
        },
        eventHost: '',
        fee: 0,
        date: '',
        description: {
            short_desc: '',
            long_desc: '',
        },
        seats: 0,
        owner: '',
        // price: 0,
        type: '',
        tickets_available: 0,
        tickets_sold: 0,
        buyers: [],
        // slides: [],
        isHuddle: false,
    } as Event)

    useEffect(() => {
        if (address) {
            getEvents(address as string)
                .then((res) => {
                    const data: Event = parseEvent(
                        res.data.childCreatedEntities[0]
                    )
                    setFeatEvent(data)
                })
                .catch((err) => {})
        }
    }, [address])

    return (
        <>
            <Box minH="100vh" h="full" overflow="hidden" bg="blackAlpha.50">
                <NavigationBar mode="white" />
                <Box p="4" />
                <Flex
                    justify="center"
                    mx="auto"
                    mt="16"
                    px="6"
                    w="full"
                    maxW="1400px"
                    experimental_spaceX="10"
                >
                    <Box maxW="1000px" w="full">
                        <Skeleton isLoaded={featEvent.id !== ''}>
                            <EventLayout event={featEvent} />
                        </Skeleton>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default Event
