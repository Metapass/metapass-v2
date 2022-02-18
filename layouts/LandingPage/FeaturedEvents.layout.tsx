import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    Skeleton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    MenuButton,
    InputGroup,
    InputLeftElement,
    Menu,
    Input,
    Heading,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import EventCard from '../../components/Card/EventCard.component'
import { events } from '../../utils/testData'
import {
    CategoryType,
    DescriptionType,
    Event,
    ImageType,
} from '../../types/Event.type'
import sendToAirtable from '../../utils/sendToAirtable'
import ScrollContainer from 'react-indiana-drag-scroll'
import { gqlEndpoint } from '../../utils/subgraphApi'
// import { MdCalendarToday as CalendarToday } from "react-icons/md";
import { HiOutlineChevronRight as ChevronRight } from 'react-icons/hi'
import axios from 'axios'
import {getAllEnsLinked} from '../../utils/resolveEns'
import { MdTag } from 'react-icons/md'
import { AiOutlineSend } from 'react-icons/ai'
import { SetStateAction } from 'react'

export default function FeaturedEvents() {
    const [email, setEmail] = useState<string>('')
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
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                    link
                    ticketsBought{
                        id
                    }
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
    function UnicodeDecodeB64(str: any) {
        return decodeURIComponent(atob(str))
    }
    const parseFeaturedEvents = (featuredEvents: Array<any>): Event[] => {
        return featuredEvents.map((event: { event: any }) => {
            let type = JSON.parse(
                UnicodeDecodeB64(event.event.category)
            ).event_type
            let category: CategoryType = JSON.parse(
                UnicodeDecodeB64(event.event.category)
            )
            let image: ImageType = JSON.parse(
                UnicodeDecodeB64(event.event.image)
            )
            let desc: DescriptionType = JSON.parse(
                UnicodeDecodeB64(event.event.description)
            )
            // console.log(event.event.seats, event.event.buyers.length)
            return {
                id: event.event.id,
                title: event.event.title,
                childAddress: event.event.childAddress,
                category: category,
                image: image,
                eventHost: event.event.eventHost,
                fee: Number(event.event.fee) / 10 ** 18,
                date: event.event.date,
                description: desc,
                seats: event.event.seats,
                owner: event.event.eventHost,
                link: event.event.link,
                type: type,
                tickets_available:
                    event.event.seats - event.event.ticketsBought.length,
                tickets_sold: event.event.ticketsBought.length,
                buyers: event.event.buyers,
            } as Event
            
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
                                    <Skeleton
                                        maxW={{ base: '330px', xl: '390px' }}
                                        key={key}
                                        minW={{ base: '330px', xl: '390px' }}
                                        isLoaded={data.id !== ''}
                                    >
                                        <EventCard event={data} />
                                    </Skeleton>
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
                        onClick={onOpen}
                    >
                        Explore all events
                    </Button>

                    <Modal
                        size="xl"
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <Flex justify="center">
                                <Image
                                    src="/assets/elements/bolt.png"
                                    maxH="20"
                                    maxW="20"
                                    pos="absolute"
                                    // skewY="50px"
                                    zIndex="overlay"
                                    top="-10"
                                    //   left="250"
                                    alt="bolt"
                                />
                            </Flex>
                            <ModalBody
                                //   borderRadius="xl"
                                p="10"
                            >
                                <Flex
                                    flexDir="column"
                                    justify="center"
                                    align="center"
                                >
                                    <Heading
                                        fontFamily="azonix"
                                        textAlign="center"
                                        //  fontFamily="azonix"
                                        fontSize={{
                                            base: '3xl',
                                            lg: '3xl',
                                            xl: '3xl',
                                        }}
                                    >
                                        JOIN THE WAITLIST
                                    </Heading>
                                    <Text
                                        m="4"
                                        p="4"
                                        lineHeight="23.72px"
                                        letterSpacing="3%"
                                        fontFamily="Product Sans"
                                        fontSize="18px"
                                        color="rgba(0, 0, 0, 0.31)"
                                        maxW="500px"
                                        height="63.08px"
                                        fontWeight="400"

                                        //  noOfLines={4}
                                    >
                                        We&apos;re on the mission to revolutionize
                                        event ticketing with blockchain, join
                                        the waitlist and lets band together on
                                        this journey! 🚀
                                    </Text>
                                    <EmailBar
                                        email={email}
                                        setEmail={setEmail}
                                        onClose={onClose}
                                    />
                                </Flex>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Box>
        </Flex>
    )
}

export const EmailBar = ({ email, setEmail, onClose }: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    return (
        <Flex
            boxShadow="0px 18px 91px rgba(0, 0, 0, 0.07)"
            bg="white"
            rounded="full"
            alignItems="center"
            mt="6"
            pl="6"
            fontSize="lg"
            w="85%"
            justify="space-between"
        >
            <Flex w="full" alignItems="center">
                <InputGroup>
                    <Input
                        bg="transparent"
                        border="none"
                        _focus={{}}
                        _hover={{}}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        rounded="none"
                        placeholder="gm@metapasshq.xyz"
                    />
                </InputGroup>

                <Box minW="2.5px" bg="gray.100" h="12" />
            </Flex>
            <Button
                role="group"
                leftIcon={
                    <Flex
                        justify="center"
                        alignItems="center"
                        _groupHover={{ transform: 'scale(1.1)' }}
                        transitionDuration="200ms"
                    >
                        {' '}
                        <AiOutlineSend
                            size="22px"
                            style={{
                                rotate: '-45deg',
                            }}
                        />
                    </Flex>
                }
                _hover={{}}
                _focus={{}}
                _active={{}}
                rounded="full"
                color="white"
                bg="brand.gradient"
                roundedBottomLeft="none"
                py="8"
                px="8"
                fontSize="lg"
                isLoading={isSubmitting}
                // loadingText='Submitting'
                onClick={() => {
                    // setIsSubmitting(true)
                    sendToAirtable(email, setIsSubmitting, onClose)
                }}
            >
                Join
            </Button>
        </Flex>
    )
}
