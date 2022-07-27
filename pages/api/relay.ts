// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req.body)
    try {
        const tx = await axios.post(
            'https://solana-relayer.vercel.app/api/tx',
            req.body
        )

        res.status(200).json(tx.data)
    } catch (error) {
        res.status(500).json({ error })
    }
}
