import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const { title, child, host } = req.body;
        axios({
            method: 'POST',
            url:
                "https://cors-anywhere-production-4dbd.up.railway.app/" + process.env.NEXT_PUBLIC_HUDDLE_API +
                '/create-meeting',
            data: {
                title: title,
                contractAd1: child,
                chain: 'polygon',
                host: host,
            },
            headers: {
                Accept: '*/*',
                Authorization:
                    'Bearer ' +
                    process.env.NEXT_PUBLIC_HUDDLE_KEY,
                ContentType: 'application/json',
            },
        }).then(r => {
            res.json({ roomLink: r.data.roomLink });
        }).catch(e => {
            res.status(200);
            res.json({ error: e });
        })
    } else {
        res.status(400).json({ msg: 'wrong method' })
    }
}
