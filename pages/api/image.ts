import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    const { title, ticketNumber, person, months, parsedDate, url } = req.body;
    const BASE_ENDPOINT = 'https://ticket-img-production-f075.up.railway.app';
    const { data } = await axios.get(
      `${BASE_ENDPOINT}/api/v2/2d/edit/hero_text=${title}&ticket_no=${ticketNumber.toString()}&venue=${person}&date=${
        months[new Date(parsedDate).getMonth()] +
        ' ' +
        new Date(parsedDate).getDate()
      }?url=${url}`,
    );
    res.status(200).send(data);
  }
}
