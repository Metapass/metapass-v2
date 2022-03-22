import crypto from 'crypto-js'

export const encryptLink = (link: string) => {
    let enc = crypto.AES.encrypt(
        link,
        process.env.NEXT_PUBLIC_SECRET as string
    ).toString()
    return enc
}

export const decryptLink = (link: string) => {
    let dec = crypto.AES.decrypt(link, process.env.NEXT_PUBLIC_SECRET as string)
    return dec.toString(crypto.enc.Utf8)
}
