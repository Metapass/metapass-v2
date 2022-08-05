import sgMail from '@sendgrid/mail'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { MailDataRequired } from '@sendgrid/mail'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, message, subject } = JSON.parse(req.body)

        sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

        const msg: MailDataRequired = {
            to: email,
            from: 'admin@metapasshq.xyz',
            subject: subject,
            text: message,
        }

        try {
            const response = await sgMail.send(msg)

            res.status(200).json({
                status: 200,
                message: 'Mail sent!',
                data: response,
                email: email,
            })
        } catch (error) {
            res.status(404).json({
                status: 404,
                message: 'Error sending mail',
                data: error,
                email: email,
            })
        }
    }
}

export default handler
