import pinataSDK from '@pinata/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
const pinata = pinataSDK(
    process.env.PINATA_API as string,
    process.env.PINATA_SECRET as string
)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        pinata
            .pinByHash(req.body.hash)
            .then((result: any) => {
                res.status(200).send({
                    msg: 'Pinned to ipfs',
                })
            })
            .catch((error: any) => {
                res.status(400).send({
                    msg: 'failed to pin ' + error,
                })
            })
    } else {
        res.status(400).send({ msg: 'wrong method bro' })
    }
}
