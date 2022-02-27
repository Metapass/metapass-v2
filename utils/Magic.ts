import { Magic } from 'magic-sdk'
import Web3 from 'web3'
import { OAuthExtension } from '@magic-ext/oauth';
export default function LinkMagic(env: string) {
    const mumbai = {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com/', // Polygon RPC URL

        chainId: 80001, // Polygon chain id
    }
    const polygon = {
        rpcUrl: 'https://rpc-mainnet.maticvigil.com/', // Polygon RPC URL

        chainId: 137, // Polygon chain id
    }
 const network = env === 'prod'? polygon : mumbai
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        network: network,
        extensions: [new OAuthExtension()],
    })
    
    const web3: Web3 = new Web3(magic.rpcProvider)
    return {magic,web3,network}
}
