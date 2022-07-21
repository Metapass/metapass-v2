import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { child, event_type, inviteOnly } = req.body

        if (!child || !event_type || !inviteOnly) {
            res.status(405).json({ msg: 'you forgot child and category' })
        }
        try {
            const supabase = createClient(
                process.env.SUPABASE_URL as string,
                process.env.SUPABASE_PK as string
            )
            console.log(child, event_type, inviteOnly)
            const { data, error } = await supabase.from('events').insert([
                {
                    contractAddress: child,
                    inviteOnly: inviteOnly,
                    IRL: event_type === 'In-Person',
                },
            ])
            console.log(data, error)
            res.status(data ? 200 : 400).json({ data, error })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error })
        }
    } else {
        res.status(400).json({ msg: 'wrong method bro' })
    }
}
