import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { utils } from 'ethers'
import { supabase } from '../../lib/config/supabaseConfig'
import { PublicKey } from '@solana/web3.js'

const cors = Cors({
    methods: ['GET', 'POST'],
})

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors)

    if (req.method === 'POST') {
        const auth = req.headers.authorization
        const { address } = req.body

        if (auth === `Bearer ${process.env.API_KEY}`) {
            if (address !== undefined) {
                try {
                    if (PublicKey.isOnCurve(address)) {
                        const { data, error } = await supabase
                            .from('users')
                            .select('email')
                            .eq('address', address)

                        data?.length === 0
                            ? res.status(404).send('User not found')
                            : res.status(200).json({ email: data?.[0]?.email })
                    } else {
                        const { data, error } = await supabase
                            .from('users')
                            .select('email')
                            .eq('address', utils.getAddress(address))

                        data?.length === 0
                            ? res.status(404).send('User not found')
                            : res.status(200).json({ email: data?.[0]?.email })
                    }
                } catch (error) {
                    res.status(404).send('Invalid address')
                }
            } else {
                res.status(400).send('Please add in address')
            }
        } else {
            res.status(401).send('Authorization Code required')
        }
    } else {
        res.status(402).send('Method not allowed')
    }
}

export default Handler
