import { Event } from '../types/Event.type'
import { create, urlSource } from 'ipfs-http-client'
import axios from 'axios'
const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT
const projectSecret = process.env.NEXT_PUBLIC_IPFS_SECRET
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
})
export const generateMetadata = async (event: Event, ticketImage: string) => {
    let SAMPLE_METADATA = {
        name: event.title,
        description: event.description.short_desc,
        image: ticketImage,
        animation_url: '',
        external_url: 'https://metapasshq.xyz',
        attributes: [
            {
                trait_type: 'background',
                value: 'transparent',
            },
            {
                trait_type: 'event',
                value: event.title,
            },
        ],
        //@deprecated -> do not use - may be removed in a future release
        collection: {
            name: `Metapass x ${event.title}`,
            family: 'Metapass',
        },
        properties: {
            files: [
                {
                    uri: ticketImage,
                    type: 'image/png',
                },
            ],
            category: 'image',
            //@deprecated -> do not use - may be removed in a future release
            creators: [
                {
                    address: event.eventHost,
                    share: 100,
                },
            ],
        },
    }
    const { data } = await axios.post('/api/addToIPFS', {
        file: JSON.stringify(SAMPLE_METADATA),
    })

    await axios.post('/api/pin', {
        hash: data.cid,
    })
    return `https://ipfs.io/ipfs/${data.cid.toString()}`
}
