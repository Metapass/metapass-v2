import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const { address } = req.body
        if (address) {
            const event = await axios.get(
                `${process.env.NEXT_PUBLIC_MONGO_API}/getEvent/${address}`
            )
            if (event.data) {
                const data = event.data

                res.status(200).send({
                    ...data,
                    owner: data.eventHost,
                    childAddress: address as string,
                    category: JSON.parse(data.category),
                    image: JSON.parse(data.image),
                    description: JSON.parse(data.description),
                    isSolana: true,
                })
            } else {
                res.status(404).send({
                    message: 'No Document Found!',
                })
            }
        } else {
            res.status(404).send('')
        }
    }
}
