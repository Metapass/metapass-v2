import axios from 'axios'
import { API_URL } from '../../../lib/constants'

const validateRoles = async (
    requiredRoles: any[],
    user: string,
    guild: string,
    token: string
) => {
    let newObj = requiredRoles.map((role) => {
        let smth = JSON.parse(role)

        return smth
    })

    let options = {
        method: 'POST',
        url: `${API_URL}/getUserRoles`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: { user: user, guild: guild },
    }

    try {
        const { data } = await axios.request(options as any)
        let newArr: any[] = []

        newObj.map((role) => {
            data.roles.map((r: any) => {
                if (r.id === role.id) {
                    newArr.push(r)
                }
            })
        })

        return newArr.length > 0
    } catch (error) {
        return false
    }
}

export { validateRoles }
