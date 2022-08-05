import axios from "axios"

const sendRegisteredMail = async(email: string) => {
    try {
        const res = await axios.post('/api/sendRegisteredMail', {
            email: email,
            subject: 'You have successfully registered for the event!',
            message: '',
        })

        return res.data
    } catch (error) {
        return error
    }
}

export { sendRegisteredMail }