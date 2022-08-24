import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const isCommonSv = async (guild: string, user: string, token: string) => {
    if (guild && user && token) {
        let options = {
            method: 'POST',
            url: 'https://metapass-discord-inte-production.up.railway.app/commonServer',
            headers: {
                Authorization: `Bearer 55161b5177ffcf436354c6a3e20ad6c77c204d7b6ec292d8fbf624a40bc72191`,
            },
            data: { user: user, guild: guild },
        }

        try {
            const { data: result } = await axios.request(options as any)

            return result
        } catch (error) {
            return error
        }
    } else {
        return false
    }
}

export { isCommonSv }
