import type { NextApiRequest, NextApiResponse } from 'next'

import { create, urlSource } from 'ipfs-http-client'
const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT
const projectSecret = process.env.NEXT_PUBLIC_IPFS_SECRET
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
})

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { file } = req.body
        const { cid } = await ipfs.add(urlSource(file))
        res.status(200).send({
            cid: cid.toString(),
        })
    }
}
