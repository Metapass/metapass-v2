import { Box, Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'
import EventCard from '../../components/Card/EventCard.component'
import {
    Event,
    DescriptionType,
    CategoryType,
    ImageType,
} from '../../types/Event.type'
import { useEffect, useState } from 'react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import EventLayout from '../../layouts/Event/Event.layout'
import EventPageCTA from '../../layouts/EventPage/EventPageCTA.layout'
// import { events } from "../../utils/testData";
import { Skeleton } from '@chakra-ui/react'
import { gqlEndpoint } from '../../utils/subgraphApi'
import axios from 'axios'
import { useRouter } from 'next/router'
import { decryptLink } from '../../utils/linkResolvers'

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
    })

    async function getFeaturedEvents() {
        const featuredQuery = {
            operationName: 'fetchFeaturedEvents',
            query: `query fetchFeaturedEvents {
          childCreatedEntities(where:{id:"${String(address).toLowerCase()}"}) {
            id
            title
            childAddress
            category
            link
            description
            date
            fee
            image
            eventHost
            seats
            buyers{
              id
            }
          }
          
    }`,
        }
        try {
            const res = await axios({
                method: 'POST',
                url: gqlEndpoint,
                data: featuredQuery,
                headers: {
                    'content-type': 'application/json',
                },
            })

            if (!!res.data?.errors?.length) {
                throw new Error('Error fetching featured events')
            }
            return res.data
        } catch (error) {
            console.log('error', error)
        }
    }
    function UnicodeDecodeB64(str: any) {
        return decodeURIComponent(atob(str))
    }
    const parseFeaturedEvents = (event: any): Event => {
        let type: string = JSON.parse(
            UnicodeDecodeB64(event.category)
        ).event_type
        let category: CategoryType = JSON.parse(
            UnicodeDecodeB64(event.category)
        )
        let image: ImageType = JSON.parse(UnicodeDecodeB64(event.image))
        let desc: DescriptionType = JSON.parse(
            UnicodeDecodeB64(event.description)
        )
        return {
            id: event.id,
            title: event.title,
            childAddress: event.childAddress,
            category: category,
            image: image,
            eventHost: event.eventHost,
            fee: Number(event.fee) / 10 ** 18,
            date: event.date,
            description: desc,
            seats: event.seats,
            owner: event.eventHost,
            link: decryptLink(event.link),
            type: type,
            tickets_available: event.seats - event.buyers?.length,
            tickets_sold: event.buyers?.length,
            buyers: event.buyers,
            slides: image.gallery,
        } as Event
    }

    useEffect(() => {
        getFeaturedEvents()
            .then((res) => {
                // console.log(res.data.childCreatedEntities[0],"res")
                const data: Event = parseFeaturedEvents(
                    res.data.childCreatedEntities[0]
                )
                // console.log(data, 'data')
                setFeatEvent(data)
            })
            .catch((err) => {
                console.log(err)
            })
        // console.log(featEvents)
    }, [address])
    return (
        <Box minH="100vh" h="full" overflow="hidden" bg="blackAlpha.50">
            <EventPageCTA />
            <Flex
                justify="center"
                mx="auto"
                mt="6"
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
    )
}

export default Event
