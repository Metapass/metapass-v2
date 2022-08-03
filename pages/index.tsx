import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import FeaturedEvents from '../layouts/LandingPage/FeaturedEvents.layout'
import HeroCTA from '../layouts/LandingPage/HeroCTA.layout'
import {
    CategoryType,
    DescriptionType,
    Event,
    ImageType,
} from '../types/Event.type'
import axios from 'axios'
import { gqlEndpoint } from '../utils/subgraphApi'

const Home: NextPage = ({ events }: any) => {
    return (
        <Box h="100vh" overflow="scroll">
            <HeroCTA />
            <Box p={{ md: '2' }} />
            <FeaturedEvents events={events} />
        </Box>
    )
}

export default Home

export const getServerSideProps = async () => {
    async function getPolygonFeaturedEvents() {
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
            return res.data
        } catch (error) {}
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
                isHuddle: event.event.link.includes('huddle01'),
                isSolana: false,
            } as Event
        })
    }
    const getSolanaFetauredEvents = async (): Promise<Event[]> => {
        let data: Event[] = []
        const event = await axios.get(
            `${process.env.NEXT_PUBLIC_MONGO_API}/featuredEvents`
        )
        if (event.data) {
            let events = event.data

            events.forEach((event: any) => {
                data.push({
                    ...event,
                    category: JSON.parse(event.category),
                    image: JSON.parse(event.image),
                    description: JSON.parse(event.description),
                    owner: event.eventHost,
                    childAddress: event.eventPDA,
                    isSolana: true,
                })
            })
            return data
        } else {
            console.log('No such document! solana events')
            return []
        }
    }
    const getFeaturedEvents = async () => {
        let allEvents: Event[] = []
        const polygonEvents = await getPolygonFeaturedEvents()
        const polygonData: Event[] = parseFeaturedEvents(
            polygonEvents.data.featuredEntities
        )
        const solanaEvents: Event[] = await getSolanaFetauredEvents()
        allEvents = [...polygonData, ...solanaEvents].reverse()
        return allEvents
    }

    const finalEvents = await getFeaturedEvents()
    return {
        props: { events: finalEvents },
    }
}
