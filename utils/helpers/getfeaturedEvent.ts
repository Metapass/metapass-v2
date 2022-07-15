import axios from 'axios'
import { gqlEndpoint } from '../subgraphApi'

const getFeaturedEvents = async (address: string) => {
    const featuredQuery = {
        operationName: 'fetchFeaturedEvents',
        query: `query fetchFeaturedEvents {
          childCreatedEntities(where:{id:"${String(address).toLowerCase()}"}) {
            id
            title
            childAddress
            category
            ticketsBought{
                id
            }
            link
            description
            date
            fee
            image
            eventHost
            seats
            buyers{
              id
            }
          }
          
    }`,
    }
    try {
        const res = await axios({
            method: 'POST',
            url: gqlEndpoint,
            data: featuredQuery,
            headers: {
                'content-type': 'application/json',
            },
        })

        if (!!res.data?.errors?.length) {
            throw new Error('Error fetching featured events')
        }
        return res.data
    } catch (error) {
        console.log('error', error)
    }
}

export { getFeaturedEvents }
