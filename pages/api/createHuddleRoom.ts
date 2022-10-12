import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const { title, host, contractAddress } = req.body;
    let roomLink = await axios.post(
      process.env.NEXT_PUBLIC_HUDDLE_API as string,
      {
        title: title,
        host: host,
        contractAddress,
      },
    );

    res.status(200).send({
      meetingLink: roomLink.data.meetingLink,
    });
  }
}
