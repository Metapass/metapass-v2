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

export async function uploadToCloudinary(image: any) {
    const formData = new FormData()

    formData.append('file', image)
    formData.append('upload_preset', 'public')
    let post = await axios.post(
        'https://api.cloudinary.com/v1_1/metapass/image/upload',
        formData
    )
    return post.data.secure_url

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
    url: string,
    date: string,
    person: string
) => {
    // const formData = new FormData()
    // formData.append('file', url)
    // formData.append(
    //     'upload_preset',
    //     process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
    // )
    // const URL = await axios({
    //     method: 'post',
    //     url: `https://api.cloudinary.com/v1_1/${
    //         process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
    //     }/upload`,
    //     data: formData,
    // })

    let parsedDate = date.split('T')[0]
    // console.log(
    //     'here',
    //     'https://res.cloudinary.com/dev-connect/image/upload/v1653499407/s0zwg5wke6ezmvlkv4lg.jpg'
    // )
    const BASE_ENDPOINT = 'https://ticket-img-production-f075.up.railway.app'
    const res = await axios.get(
        `${BASE_ENDPOINT}/api/v2/2d/edit/hero_text=${title}&ticket_no=${ticketNumber.toString()}&venue=${person}&date=${months[new Date(parsedDate).getMonth()] +
        ' ' +
        new Date(parsedDate).getDate()
        }?url=${url}`
    )
    // @ts-ignore
    let { cid } = await ipfs.add(urlSource(res.data[0]))
    await axios.post('/api/pin', {
        hash: cid.toString(),
    })
    return {
        img: `https://ipfs.io/ipfs/${cid.toString()}`,
        fastimg: res.data[0],
    }
}
