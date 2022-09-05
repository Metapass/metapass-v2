import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const { mintTasks } = req.body

        try {
            await axios.post(`https://mint-solana.up.railway.app/ix/mint`, {
                mintTasks,
            })

            res.status(200).send({ result: 'success' })
        } catch (e) {
            let er = e as Error
            res.status(500).send({ result: er.message })
        }
    }
}
