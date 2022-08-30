import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.query

    if (req.method == 'GET') {
        if (!(address as string).startsWith('0x')) {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_MONGO_API}/getTickets/${address}`
            )
            res.status(200).send(data)
        } else {
            res.status(200).send('OK')
        }
    }
}
