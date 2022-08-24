import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const getAllRoles = async (guild: string, token: string) => {
    try {
        const { data: roles } = await axios.post(`${API_URL}/roles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

            data: { guild: guild },
        })

        return roles
    } catch (error) {
        return error
    }
}

export { getAllRoles }
