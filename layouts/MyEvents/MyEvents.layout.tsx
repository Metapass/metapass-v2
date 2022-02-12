import {
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    Image,
    Tabs,
    TabList,
    Tab,
    Box,
    TabPanels,
    TabPanel,
    Grid,
    Center,
    Heading,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState,useContext } from 'react'
import EventCard from '../../components/Card/EventCard.component'
import { Event,CategoryType,DescriptionType,ImageType } from '../../types/Event.type'
import { gqlEndpoint } from '../../utils/subgraphApi'
import {walletContext} from '../../utils/walletContext'
export default function MyEvents({ isOpen, onClose }: any) {
    const [tab, setTab] = useState('upcoming')
    const [wallet] = useContext<[{address:"",balance:""}]>(walletContext);
    const [myEvents, setMyEvents] = useState<Event[]>([
        {
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

            type: '',
            tickets_available: 0,
            tickets_sold: 0,
            buyers: [],
        },
    ])
    // const [theEvent, setTheEvent] = useState<Event>()
    async function getMyEvents() {
        const myEventsQuery = {
            operationName: 'fetchMyEvents',
            query: `query fetchMyEvents {
                childCreatedEntities(where:{
                    buyers_contains:["${wallet.address.toLowerCase()}"]
                  }) {
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
              
        }`,
        }
        try {
            const res = await axios({
                method: 'POST',
                url: gqlEndpoint,
                data: myEventsQuery,
                headers: {
                    'content-type': 'application/json',
                },
            })

            if (!!res.data?.errors?.length) {
                throw new Error('Error fetching featured events')
            }
            console.log(res.data.data.childCreatedEntities)
            return res.data
        } catch (error) {
            console.log('error', error)
        }
    }
    const parseMyEvents = (myEvents: Array<any>): Event[] => {
        return myEvents.map((event: any) => {
            let type = JSON.parse(atob(event.category)).event_type
            let category: CategoryType = JSON.parse(atob(event.category))
            let image: ImageType = JSON.parse(atob(event.image))
            let desc: DescriptionType = JSON.parse(
                atob(event.description)
            )
            console.log(event.seats, event.buyers.length)
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

                type: type,
                tickets_available:
                    event.seats - event.buyers.length,
                tickets_sold: event.buyers.length,
                buyers: event.buyers,
            } as Event
     
        })
    }
    useEffect(() => {
        getMyEvents()
            .then((res) => {
                const data: Event[] = parseMyEvents(
                    res.data.childCreatedEntities
                )
                setMyEvents(data)
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })
        // console.log(myEvents)
    }, [])
    return (
        <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="2xl">
                <ModalBody>
                    <Flex
                        justify="center"
                        w="full"
                        textAlign="center"
                        mt="8"
                        mb="8"
                        direction="column"
                    >
                        <Flex justify="center" mb="4">
                            <Text
                                fontWeight="medium"
                                color="brand.black"
                                fontSize="xl"
                                position="relative"
                            >
                                My Events
                            </Text>
                            <Image
                                w="4"
                                mt="-8"
                                src="/assets/elements/sparkle_dark.svg"
                                alt="element"
                            />
                        </Flex>
                        <Flex w="full" justify="center">
                            <Tabs
                                mt="4"
                                align="center"
                                w="fit-content"
                                variant="unstyled"
                            >
                                <TabList
                                    px="2"
                                    bg="white"
                                    w="fit-content"
                                    boxShadow="0px 13px 101px rgba(0, 0, 0, 0.08)"
                                    rounded="full"
                                    border="1px"
                                    borderColor="blackAlpha.100"
                                >
                                    <Tab
                                        pb="0"
                                        display="flex"
                                        flexDirection="column"
                                        _focus={{}}
                                        onFocus={() => {
                                            setTab('upcoming')
                                        }}
                                        _hover={{
                                            color:
                                                tab !== 'upcoming' &&
                                                'blackAlpha.600',
                                        }}
                                        _active={{}}
                                        fontWeight={
                                            tab === 'upcoming'
                                                ? 'medium'
                                                : 'normal'
                                        }
                                        color={
                                            tab === 'upcoming'
                                                ? 'brand.black600'
                                                : 'blackAlpha.500'
                                        }
                                    >
                                        <Text mb="2">Upcoming Events</Text>
                                        {tab === 'upcoming' && (
                                            <Box
                                                w="full"
                                                h="1"
                                                bg="brand.gradient"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        pb="0"
                                        display="flex"
                                        flexDirection="column"
                                        _focus={{}}
                                        _active={{}}
                                        onFocus={() => {
                                            setTab('past')
                                        }}
                                        fontWeight={
                                            tab === 'past' ? 'medium' : 'normal'
                                        }
                                        _hover={{
                                            color:
                                                tab !== 'past' &&
                                                'blackAlpha.600',
                                        }}
                                        color={
                                            tab === 'past'
                                                ? 'brand.black600'
                                                : 'blackAlpha.500'
                                        }
                                    >
                                        <Text mb="2">Past Events</Text>
                                        {tab === 'past' && (
                                            <Box
                                                w="full"
                                                h="1"
                                                bg="brand.gradient"
                                            />
                                        )}
                                    </Tab>
                                </TabList>
                                <TabPanels mt="10">
                                    <TabPanel>
                                        <Grid
                                            templateColumns={{
                                                md: 'repeat(2, 1fr)',
                                                lg: 'repeat(2, 1fr)',
                                                xl: 'repeat(2, 1fr)',
                                            }}
                                            px={{ base: '6', md: '10' }}
                                            gap={6}
                                        >
                                            {myEvents.length > 0 ?myEvents.map((data, key) => (
                                                <Box
                                                    maxW={{ xl: '390px' }}
                                                    minW={{ xl: '390px' }}
                                                    key={key}
                                                >
                                                    <EventCard event={data} />
                                                </Box>
                                            )):
                                            <Box
                                                    maxW={{ xl: '390px' }}
                                                    minW={{ xl: '390px' }}
                                                  ml="300px"
                                                >
                                                <Heading
                                                
                                                textAlign="center"
            fontWeight="semibold"
            fontFamily="subheading"
            color="gray.300"
            fontSize={{ md: "23.2px", lg: "23.2px", xl: "28" }}
                                                >
                                                    
                                                    No upcoming events :(
                                                    </Heading></Box>
                                                    }
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel>
                                        <Grid
                                            templateColumns={{
                                                md: 'repeat(2, 1fr)',
                                                lg: 'repeat(2, 1fr)',
                                                xl: 'repeat(2, 1fr)',
                                            }}
                                            px={{ base: '6', md: '10' }}
                                            gap={6}
                                        >
                                            {myEvents
                                                .reverse()
                                                .map((data, key) => (
                                                    <Box
                                                        maxW={{ xl: '390px' }}
                                                        minW={{ xl: '390px' }}
                                                        key={key}
                                                    >
                                                        <EventCard
                                                            event={data}
                                                        />
                                                    </Box>
                                                ))}
                                        </Grid>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
