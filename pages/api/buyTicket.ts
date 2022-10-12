import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const { eventPDA, publicKey } = req.body;

    await axios.post(`${process.env.NEXT_PUBLIC_MONGO_API}/buyTicket`, {
      eventPDA: eventPDA,
      publicKey: publicKey,
    });

    res.status(200).send('Success');
  }
}
