import { Box, Flex, Text, Image, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import EventCard from '../../components/Card/EventCard.component'
import { events } from '../../utils/testData'
import {
    CategoryType,
    DescriptionType,
    Event,
    ImageType,
} from '../../types/Event.type'
import ScrollContainer from 'react-indiana-drag-scroll'
import { gqlEndpoint } from '../../utils/subgraphApi'
// import { MdCalendarToday as CalendarToday } from "react-icons/md";
import { HiOutlineChevronRight as ChevronRight } from 'react-icons/hi'
import axios from 'axios'
import getAllEnsLinked from '../../utils/resolveEns'

export default function FeaturedEvents() {
    const [featEvents, setFeatEvents] = useState<Event[]>([
        {
            id: '',
            title: '',
            childAddress: '',
            category: {
                event_type: '',
                category: [''],
            },
            image: {
                hero_image: '',
                gallery: [''],
                video: '',
            },
            eventHost: '',
            fee: '',
            date: '',
            description: {
                short_desc: '',
                long_desc: '',
            },
            seats: 0,
            owner: '',
            price: 0,
            type: '',
            tickets_available: 0,
            tickets_sold: 0,
            buyers: [],
            slides: [],
        },
    ])
    // const [theEvent, setTheEvent] = useState<Event>()
    async function getFeaturedEvents() {
        const featuredQuery = {
            operationName: 'fetchFeaturedEvents',
            query: `query fetchFeaturedEvents {
              featuredEntities{
                id
                count
                event{
                    id
                    title
                    childAddress
                    category
                    image
                    buyers{
                        id
                        
                    }
                    eventHost
                    fee
                    seats
                    description
                    date
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
            console.log(res.data.data.featuredEntities)
            return res.data
        } catch (error) {
            console.log('error', error)
        }
    }
    const parseFeaturedEvents = (featuredEvents: any): Event[] => {
        return featuredEvents.map((event: { event: any }) => {
            let type = JSON.parse(atob(event.event.category)).event_type
            let category: CategoryType = JSON.parse(atob(event.event.category))
            let image: ImageType = JSON.parse(atob(event.event.image))
            let desc: DescriptionType = JSON.parse(
                atob(event.event.description)
            )
            console.log(event.event.seats, event.event.buyers.length)
            return {
                id: event.event.id,
                title: event.event.title,
                childAddress: event.event.childAddress,
                category: category,
                image: image,
                eventHost: event.event.eventHost,
                fee: String(Number(event.event.fee) / 10 ** 18),
                date: event.event.date,
                description: desc,
                seats: event.event.seats,
                owner: event.event.eventHost,
                price: Number(event.event.fee) / 10 ** 18,
                type: type,
                tickets_available:
                    event.event.seats - event.event.buyers.length,
                tickets_sold: event.event.buyers.length,
                buyers: event.event.buyers,
                slides: image.gallery,
            } as Event
            // getAllEnsLinked('0x99Ec99FCdAd66Ca801DEf23b432500fF045251f9')
            //     .then((ens: any) => {
            //         setTheEvent({
            //             id: event.event.id,
            //             title: event.event.title,
            //             childAddress: event.event.childAddress,
            //             category: category,
            //             image: image,
            //             eventHost: event.event.eventHost,
            //             fee: String(Number(event.event.fee) / 10 ** 18),
            //             date: event.event.date,
            //             description: event.event.description,
            //             seats: event.event.seats,
            //             owner: ens.length > 0 ? ens[0].name : '',
            //             price: Number(event.event.fee) / 10 ** 18,
            //             type: type,
            //             tickets_available:
            //                 event.event.seats - event.event.buyers.length,
            //             tickets_sold: event.event.buyers.length,
            //             buyers: event.event.buyers,
            //             slides: event.event.slides,
            //         })
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //     })
            // return theEvent
        })
    }
    useEffect(() => {
        getFeaturedEvents()
            .then((res) => {
                const data: Event[] = parseFeaturedEvents(
                    res.data.featuredEntities
                )
                setFeatEvents(data)
            })
            .catch((err) => {
                console.log(err)
            })
        // console.log(featEvents)
    }, [])
    return (
        <Flex w="full" justify="center" mb="-48">
            <Box w="full" pb="20">
                <Flex maxW="1200px" mx={{ base: '12', xl: '40' }}>
                    <Text
                        fontWeight="medium"
                        color="brand.black"
                        fontSize={{ base: '3xl', xl: '4xl' }}
                        position="relative"
                    >
                        Featured Events
                    </Text>
                    <Image
                        w={{ lg: '5', xl: '6' }}
                        mt="-8"
                        src="/assets/elements/sparkle_dark.svg"
                        alt="element"
                    />
                </Flex>
                <Flex _active={{ cursor: 'grabbing' }} my="8">
                    <ScrollContainer
                        style={{
                            paddingTop: '100px',
                            paddingBottom: '100px',

                            transform: 'translateY(-100px)',
                        }}
                    >
                        <Flex
                            experimental_spaceX="8"
                            mx={{ base: '10', xl: '20' }}
                        >
                            {featEvents.map((data, key) => (
                                <Box
                                    maxW={{ base: '330px', xl: '390px' }}
                                    key={key}
                                    minW={{ base: '330px', xl: '390px' }}
                                >
                                    <EventCard event={data} />
                                </Box>
                            ))}
                            <Box p="10" />
                        </Flex>
                    </ScrollContainer>
                </Flex>
                <Flex justify="center" transform="translateY(-160px)">
                    <Button
                        size="lg"
                        rounded="full"
                        bg="brand.gradient"
                        color="white"
                        rightIcon={
                            <Flex
                                justify="center"
                                alignItems="center"
                                transitionDuration="200ms"
                                _groupHover={{ transform: 'translateX(4px)' }}
                            >
                                <ChevronRight />
                            </Flex>
                        }
                        _hover={{}}
                        _focus={{}}
                        _active={{}}
                        py="7"
                        role="group"
                        fontWeight="medium"
                        px="8"
                        onClick={() => (window.location.href = '/events')}
                    >
                        Explore all events
                    </Button>
                </Flex>
            </Box>
        </Flex>
    )
}
