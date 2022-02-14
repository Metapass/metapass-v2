import {
    Box,
    Divider,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import SearchBar from '../../components/Elements/SearchBar.component'
import ExploreCTA from '../../layouts/Explore/ExploreCTA.layout'
import FeaturedEvents from '../../layouts/Explore/FeaturedEvents.layout'
import QueriedEvents from '../../layouts/Explore/QueriedEvents.layout'
import { AnimatePresence, motion } from 'framer-motion'
import PageLayout from '../../components/Wrappers/PageLayout.component'
import { useRouter } from 'next/router'
import EventLayout from '../../layouts/Event/Event.layout'
import { events } from '../../utils/testData'

import {
    Event,
    DescriptionType,
    CategoryType,
    ImageType,
} from '../../types/Event.type'

import { gqlEndpoint } from '../../utils/subgraphApi'
import axios from 'axios'

const Explore: NextPage = () => {
    const [isScrolling, setScrolling] = useState(true)
    const router = useRouter()
    const { query } = router.query
    const [showEventModal, setEventModal] = useState<boolean>(
        query ? (query[0] ? true : false) : false
    )

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
        type: '',
        tickets_available: 0,
        tickets_sold: 0,
        buyers: [],
    })

    async function getFeaturedEvents() {
        const featuredQuery = {
            operationName: 'fetchFeaturedEvents',
            query: `query fetchFeaturedEvents {
          childCreatedEntities(where:{id:"${String(query).toLowerCase()}"}) {
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
    function UnicodeDecodeB64(str:any) {
        return decodeURIComponent(atob(str));
    };
    const parseFeaturedEvents = (event: any): Event => {
        let type: string = JSON.parse(UnicodeDecodeB64(event.category)).event_type
        let category: CategoryType = JSON.parse(UnicodeDecodeB64(event.category))
        let image: ImageType = JSON.parse(UnicodeDecodeB64(event.image))
        let desc: DescriptionType = JSON.parse(UnicodeDecodeB64(event.description))
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
            link: event.link,
            type: type,
            tickets_available: event.seats - event.buyers.length,
            tickets_sold: event.buyers.length,
            buyers: event.buyers,
            slides: image.gallery,
        } as Event
    }

    useEffect(() => {
        setEventModal(query ? (query[0] ? true : false) : false)
        getFeaturedEvents().then((res) => {
            const data: Event = parseFeaturedEvents(
                res.data.childCreatedEntities[0]
            )
            setFeatEvent(data)
        })
    }, [query])

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 240) {
                setScrolling(false)
            } else {
                setScrolling(true)
            }
        })
    }, [])

    return (
        <PageLayout>
            {showEventModal && (
                <Modal
                    isCentered
                    size="5xl"
                    isOpen={showEventModal}
                    onClose={() => {
                        setEventModal(false)
                    }}
                >
                    <ModalOverlay />

                    <ModalContent rounded={{ base: 'none', lg: 'xl' }}>
                        <ModalCloseButton
                            bg="white"
                            _focus={{}}
                            _active={{}}
                            roundedRight="full"
                            zIndex={9999}
                            _hover={{ color: 'brand.peach' }}
                            top="2"
                            right="-6"
                        />
                        <ModalBody>
                            <EventLayout event={featEvent} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            <Head>
                <title>MetaPass | Explore</title>
            </Head>
            <Box minH="100vh" h="full" overflowX="hidden">
                <AnimatePresence>
                    {!isScrolling && (
                        <motion.div
                            initial={{ opacity: 0, y: -200 }}
                            transition={{ duration: 0.4 }}
                            animate={{ opacity: [0, 1], y: [-200, 0] }}
                            exit={{ y: [0, -200] }}
                            style={{
                                width: '100%',
                                position: 'fixed',
                                zIndex: 999,
                                boxShadow: '0px 18px 91px rgba(0, 0, 0, 0.07)',
                            }}
                        >
                            <Box
                                w="full"
                                bg="black"
                                backgroundImage={`url("/assets/gradient.png")`}
                                backgroundSize="cover"
                                backgroundRepeat="no-repeat"
                            >
                                <Flex
                                    w="full"
                                    px={{ md: '20' }}
                                    justify="center"
                                    transform="translateY(35px)"
                                >
                                    <SearchBar noEffects />
                                </Flex>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
                <ExploreCTA />
                <FeaturedEvents />
                <Box mx="auto" pb="10" pt="3" maxW="400px">
                    <Divider filter="brightness(95%)" />
                </Box>
                <Flex justify="center" pb="20">
                    <QueriedEvents />
                </Flex>
            </Box>
        </PageLayout>
    )
}

export default Explore
