import { Event } from '../types/Event.type'
import { create, urlSource } from 'ipfs-http-client'
import axios from 'axios'

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
})
export const generateMetadata = async (event: Event, ticketImage: string) => {
    try {
        let SAMPLE_METADATA = {
            name: event.title,
            description: event.description.short_desc,
            image: ticketImage,
            animation_url: '',
            external_url: 'https://metapasshq.xyz',
            attributes: [
                {
                    trait_type: 'trait1',
                    value: 'value1',
                },
                {
                    trait_type: 'trait2',
                    value: 'value2',
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
        let { cid } = await ipfs.add(JSON.stringify(SAMPLE_METADATA))
        await axios.post('/api/pin', {
            hash: cid.toString(),
        })
        return `https://ipfs.io/ipfs/${cid.toString()}`
    } catch (error) {
        console.log('error in generateMetadata.ts', error)
    }
}
