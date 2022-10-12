import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const {
      id,
      title,
      category,
      image,
      eventPDA,
      eventHost,
      date,
      description,
      seats,
      type,
      link,
      fee,
      venue,
    } = req.body;

    const r = await axios.post(`${process.env.NEXT_PUBLIC_MONGO_API}/create`, {
      id,
      title,
      category,
      image,
      eventPDA,
      eventHost,
      date,
      description,
      seats,
      type,
      link,
      fee,
      venue,
    });

    res.status(200).send(r);
  }
}
