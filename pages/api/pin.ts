import pinataSDK from '@pinata/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
const pinata = pinataSDK(
    'cb7410f63fae89c24983',
    '43c7dd30459fc03197ed37237abbf6bb63adeaf665b7a6459f711625082141bc'
)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        pinata
            .pinByHash(req.body.hash)
            .then((result: any) => {
                res.status(200).json({
                    msg: 'pinned to ipfs',
                })
            })
            .catch((error: any) => {
                res.status(400).json({
                    msg: 'failed to pin ' + error,
                })
            })
    } else {
        res.status(400).json({ msg: 'wrong method bro' })
    }
}
