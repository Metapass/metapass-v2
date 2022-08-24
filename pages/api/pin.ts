import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { hash } = req.body

        try {
            const { data } = await axios.post(
                'https://api.pinata.cloud/pinning/pinByHash',
                {
                    hashToPin: hash,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PINATA_JWT}`,
                    },
                }
            )
            res.status(200).json({ msg: 'pinned!', data, hash })
        } catch (error) {
            res.status(500).json({ msg: 'error', error })
        }
    } else {
        res.status(400).json({ msg: 'wrong method bro' })
    }
}
