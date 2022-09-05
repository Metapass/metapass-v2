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
                    `https://api.helius.xyz/v0/addresses/${address}/names?api-key=74edbdf5-7aa8-4cf1-9ea2-c82cece42421`,
                    {
                        method: 'GET',
                    }
                )

                const accounts = data.domainNames

                // console.log(accounts, 'address', data)
                // console.log(accounts.length)
                if (accounts.length > 0) {
                    return { domain: accounts[0], loading: false }
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
