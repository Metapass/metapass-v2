import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const { title, child, host } = req.body
        axios({
            method: 'POST',
            url: process.env.NEXT_PUBLIC_HUDDLE_API as string,
            data: {
                title: title,
                contractAddress: child,
                host: host,
            },
        })
            .then((r) => {
                res.status(200).send({ meetingLink: r.data.meetingLink })
            })
            .catch((e) => {
                res.status(200)
                res.json({ error: e })
            })
    } else {
        res.status(400).json({ msg: 'Incorrect Method' })
    }
}
