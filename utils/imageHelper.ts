import axios from 'axios'
import { create, urlSource } from 'ipfs-http-client'

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
})

const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
]

export async function uploadImage(image: any) {
    let id = await ipfs.add(image)

    return `https://ipfs.io/ipfs/${id.cid}`
}

export function getBlob(file: any) {
    if (file) {
        return URL.createObjectURL(file)
    }
}

export function getBuffer(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export async function loadImage(url: string) {
    let data = await axios.get(url)
    return data
}

export const ticketToIPFS = async (
    title: string,
    ticketNumber: Number,
    url: String,
    date: string
) => {
    const res = await axios.get(
        `https://radiant-caverns-43873.herokuapp.com/v2/2d/edit/url=${url}&hero_text=${title}&ticket_no=${ticketNumber.toString()}&venue=HUddle01&date=${
            months[new Date(date).getMonth()] + ' ' + new Date(date).getDate()
        }`
    )
    // @ts-ignore
    let { cid } = await ipfs.add(urlSource(res.data[0]))
    await axios.post('/api/pin', {
        hash: cid.toString(),
    })
    return `https://ipfs.io/ipfs/${cid.toString()}`
}
