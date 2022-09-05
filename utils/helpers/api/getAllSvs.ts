import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const getAllSvs = async (token: string) => {
    try {
        const { data: guilds } = await axios.get(`${API_URL}/botGuilds`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return guilds
    } catch (error) {
        return error
    }
}

export { getAllSvs }
