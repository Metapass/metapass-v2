import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const getAllRoles = async (guild: string, token: string) => {
    let options = {
        method: 'POST',
        url: 'https://metapass-discord-inte-production.up.railway.app/roles',
        headers: {
            Authorization:
                `Bearer ${token}`,
        },
        data: { guild: guild },
    }

    try {
        const { data: roles } = await axios.request(options as any)

        return roles
    } catch (error) {
        return error
    }
}

export { getAllRoles }
