import { db } from '../../utils/firebaseUtils'
import { doc, getDoc } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
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
                const docRef = doc(db, 'users', address as string)
                const docSnap = await getDoc(docRef)
                docSnap.exists()
                    ? res.status(200).json({
                          email: docSnap.data().email,
                          address: address.toLowerCase(),
                      })
                    : res.status(404).json({
                          message: 'Failed to load user data',
                      })
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
