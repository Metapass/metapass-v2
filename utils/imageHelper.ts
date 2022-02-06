import axios from "axios"
import { create } from "ipfs-http-client"

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
})

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
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export async function loadImage(url: string) {
    let data = await axios.get(url);
    return data;
}