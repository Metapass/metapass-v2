import { ethers } from 'ethers'

import { Chain } from '../types/blockchain.types'
import axios from 'axios'
declare const window: any

// console.log(address)
const resolveDomains = async (chain: Chain | null, address: string | null) => {
    // setDomain({ domain: null, loading: true })
    try {
        if (address !== null) {
            if (chain === 'POLYGON' || chain === 'ETH') {
                if (!window.ethereum || !address) return
                const provider = new ethers.providers.AlchemyProvider()
                const ethdomain = await provider.lookupAddress(address)
                return { domain: ethdomain, loading: false }
            } else if (chain === 'SOL') {
                if (!window.solana || !address) return

                const { data } = await axios(
                    `https://api.shyft.to/sol/v1/wallet/get_domains?network=mainnet-beta&wallet=${address}`,
                    {
                        method: 'GET',
                        headers: {
                            'x-api-key': process.env
                                .NEXT_PUBLIC_SHYFT_KEY as string,
                        },
                    }
                )

                const accounts = data?.result
                // console.log(accounts, 'address', data)
                // console.log(accounts)
                if (accounts.length > 0) {
                    return { domain: accounts[0].name, loading: false }
                } else {
                    return { domain: null, loading: false }
                }

            }
        } else {
            return { domain: null, loading: false }
        }
    } catch (error) {
        console.log(error)
    }
}

export default resolveDomains
