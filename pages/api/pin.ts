import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log(process.env.PINATA_JWT)
        const { hash } = req.body
        axios
            .post(
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
            .then(() => {
                res.status(200).send({
                    msg: 'pinned!',
                })
            })
            .catch((error) => {
                res.status(400).send({ error })
            })
    } else {
        res.status(400).json({ msg: 'wrong method bro' })
    }
}
