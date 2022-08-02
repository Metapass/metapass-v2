import { Box, Flex } from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from 'next'
import {
    CategoryType,
    DescriptionType,
    Event,
    ImageType,
} from '../../types/Event.type'
import { useEffect, useState } from 'react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import EventLayout from '../../layouts/Event/Event.layout'
import { Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { gqlEndpoint } from '../../utils/subgraphApi'
import { eventData } from '../../lib/constants'
import { supabase } from '../../lib/config/supabaseConfig'

interface IPageProps {
    isInviteOnly: boolean
}

const Event: NextPage<IPageProps> = ({ isInviteOnly }) => {
    const router = useRouter()

    const { address } = router.query

    const [featEvent, setFeatEvent] = useState<Event>(eventData)

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
            isSolana: false,
            isHuddle: event.link.includes('huddle'),
        } as Event
    }

    const getSolanaEvents = async () => {
        const event = await axios.get(
            `https://cors-anywhere-production-4dbd.up.railway.app/${process.env.NEXT_PUBLIC_MONGO_API}/getEvent/${address}`
        )
        if (event.data) {
            const data = event.data
            console.log(data)
            console.log(address)
            setFeatEvent({
                ...data,
                owner: data.eventHost,
                childAddress: address as string,
                category: JSON.parse(data.category),
                image: JSON.parse(data.image),
                description: JSON.parse(data.description),
                isSolana: true,
            })
        } else {
            console.log('No such document!')
        }
    }
    useEffect(() => {
        getFeaturedEvents()
            .then((res) => {
                // console.log(res.data.childCreatedEntities[0],"res")
                if (res.data.childCreatedEntities[0]) {
                    const data: Event = parseFeaturedEvents(
                        res.data.childCreatedEntities[0]
                    )

                    // console.log(data, 'data')
                    setFeatEvent(data)
                } else {
                    getSolanaEvents()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [address])

    return (
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
                            isInviteOnly={isInviteOnly}
                        />
                    </Skeleton>
                </Box>
            </Flex>
        </Box>
    )
}

export default Event

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { address } = ctx.query

    const { data, error } = await supabase
        .from('events')
        .select('inviteOnly')
        .eq('contractAddress', address)
    return {
        props: {
            isInviteOnly: data?.[0].inviteOnly,
        },
    }
}
