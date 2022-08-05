import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

import {
    CategoryType,
    DescriptionType,
    Event,
    ImageType,
} from '../../types/Event.type'

import { gqlEndpoint } from '../../utils/subgraphApi'

import { ethers } from 'ethers'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.body
    let parsedEvent: any

    async function getFeaturedEvents() {
        const featuredQuery = {
            operationName: 'fetchFeaturedEvents',
            query: `query fetchFeaturedEvents {
                childCreatedEntities(where:{id:"${String(
                    address
                ).toLowerCase()}"}) {
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
                    venue
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
        try {
            return decodeURIComponent(Buffer.from(str, 'base64').toString())
        } catch (error) {
            return decodeURIComponent(Buffer.from(str, 'utf-8').toString())
        }
    }
    const parseFeaturedEvents = (event: any) => {
        if (event) {
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
            let venue = JSON.parse(UnicodeDecodeB64(event.venue))
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
                venue: venue ? venue : null,
                tickets_available: event.seats - event.ticketsBought?.length,
                tickets_sold: event.ticketsBought?.length,
                buyers: event.buyers,
                slides: image.gallery,
                isSolana: false,
                isHuddle: event.link.includes('huddle01'),
            } as Event
        } else {
            return null
        }
    }
    const getSolanaEvents = async () => {
        const event = await axios.get(
            `${process.env.NEXT_PUBLIC_MONGO_API}/getEvent/${address}`
        )
        if (event.data) {
            const data = event.data
            return {
                ...data,
                owner: data.eventHost,
                childAddress: address as string,
                category: JSON.parse(data.category),
                image: JSON.parse(data.image),
                description: JSON.parse(data.description),
                isSolana: true,
            }
        } else {
            return null
        }
    }
    if (req.method == 'POST') {
        if (address) {
            const isEtherAddress = ethers.utils.isAddress(address)

            if (isEtherAddress) {
                const event = await getFeaturedEvents()
                parsedEvent = parseFeaturedEvents(
                    event.data.childCreatedEntities[0]
                )
            } else {
                parsedEvent = await getSolanaEvents()
            }
        }
        res.status(200).send(parsedEvent)
    }
}
