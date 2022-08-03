import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function (req: NextApiRequest, res: NextApiResponse) {
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
        res.status(200).send({
            events: data,
        })
    } else {
        console.log('No such document! solana events')
        res.status(200).send({
            events: [],
        })
    }
}
