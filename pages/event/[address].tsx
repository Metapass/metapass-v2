import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import type { NextPage } from 'next'

import {
    Event,
    DescriptionType,
    CategoryType,
    ImageType,
} from '../../types/Event.type'
import { useContext, useEffect, useState } from 'react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import EventLayout from '../../layouts/Event/Event.layout'
import { Skeleton } from '@chakra-ui/react'
import { gqlEndpoint } from '../../utils/subgraphApi'
import axios from 'axios'
import { useRouter } from 'next/router'
import { SignUpModal } from '../../components'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../../utils/firebaseUtils'
import { walletContext } from '../../utils/walletContext'
import { onAuthStateChanged, User } from 'firebase/auth'

const Event: NextPage = () => {
    const router = useRouter()
    const { address } = router.query
    const [wallet] = useContext(walletContext)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user, setUser] = useState<User>()

    onAuthStateChanged(auth, (user) => {
        setUser(user as User)
    })

    useEffect(() => {
        const addData = async () => {
            const docRef = doc(db, 'users', wallet.address)
            await setDoc(
                docRef,
                {
                    email: user?.email,
                },
                { merge: true }
            )
        }

        addData()
    }, [user, wallet])

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
    } as Event)

    async function getFeaturedEvents() {
        const featuredQuery = {
            operationName: 'fetchFeaturedEvents',
            query: `query fetchFeaturedEvents {
          childCreatedEntities(where:{id:"${String(address).toLowerCase()}"}) {
            id
            title
            childAddress
            category
            ticketsBought{
                id
            }
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
            link: event.link,
            type: type,
            tickets_available: event.seats - event.ticketsBought?.length,
            tickets_sold: event.ticketsBought?.length,
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
        <>
            {!user && (
                <SignUpModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            )}
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
                            <EventLayout
                                event={featEvent}
                                address={address as string}
                            />
                        </Skeleton>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default Event
