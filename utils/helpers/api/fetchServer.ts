import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const fetchServer = async (guild: string, token: string) => {
    let options = {
        method: 'POST',
        url: `${API_URL}/getServer`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: { guild: guild },
    }

    try {
        const { data } = await axios.request(options as any)

        return data
    } catch (error) {
        return error
    }
}

export { fetchServer }
