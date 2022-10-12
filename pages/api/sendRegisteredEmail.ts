import sgMail from '@sendgrid/mail';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { MailDataRequired } from '@sendgrid/mail';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, message, subject } = req.body;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!); //
    if (email && message && subject) {
      // const msg: MailDataRequired = {
      //     to: email,
      //     from: 'events@metapasshq.xyz',
      //     subject: subject,
      //     text: message,
      // }
      try {
        const response = await sgMail.send({
          personalizations: [
            {
              to: [email as string],
            },
          ],
          subject: subject,
          content: [
            {
              type: 'text/html',
              value: message,
            },
          ],
          from: {
            email: 'events@metapasshq.xyz',
            name: 'Metapass Notifications',
          },
          sendAt: 0,
        });

        res.status(200).json({
          status: 200,
          message: 'Mail sent!',
          data: response,
          email: email,
        });
      } catch (error) {
        res.status(404).json({
          status: 404,
          message: 'Error sending mail',
          data: error,
          email: email,
        });
      }
    } else {
      res.status(400).json({
        staus: 400,
        message: 'Missing values',
      });
    }
  } else {
    res.status(405).json({
      status: 405,
      message: 'Method not allowed',
    });
  }
};

export default handler;
