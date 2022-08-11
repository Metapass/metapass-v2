import axios from 'axios'
import { Event } from '../../types/Event.type'

const sendRegisteredMail = async (email: string, event: string) => {
    const res = await axios.post('/api/sendRegisteredEmail', {
        email: email,
        subject: 'You have successfully registered for the event!',
        message: `Hey! You've successfully registered for ${event}`,
    })

    return res.data
}

export { sendRegisteredMail }
