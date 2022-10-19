import axios from 'axios';
import { gqlEndpoint } from '../subgraphApi';

const getEvents = async (address: string) => {
  const query = {
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
  };
  try {
    const res = await axios({
      method: 'POST',
      url: gqlEndpoint,
      data: query,
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!!res.data?.errors?.length) {
      throw new Error('Error fetching featured events');
    }
    return res.data;
  } catch (error) {
    console.log('error', error);
  }
};

export { getEvents };
