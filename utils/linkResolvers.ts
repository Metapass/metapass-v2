import crypto from 'crypto-js';

export const encryptLink = (link: string) => {
  let enc = crypto.AES.encrypt(
    link,
    process.env.NEXT_PUBLIC_SECRET as string,
  ).toString();
  return enc;
};

export const decryptLink = (link: string) => {
  let dec = crypto.AES.decrypt(link, process.env.NEXT_PUBLIC_SECRET as string);
  // console.log(link, ' | ', dec, dec.toString(crypto.enc.Utf8))
  try {
    return dec.toString(crypto.enc.Utf8);
  } catch (e) {
    let error = e as Error;
    if (error.message.includes('Malformed UTF-8 data')) {
      return dec.toString(crypto.enc.Base64);
    }
  }
};
