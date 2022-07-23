import { ethers } from 'ethers'
import { useState, useEffect, useCallback } from 'react'
import { Chain } from '../types/blockchain.types'
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js'
import {
    performReverseLookup,
    NAME_PROGRAM_ID,
} from '@bonfida/spl-name-service'
import axios from 'axios'
declare const window: any
// const SOL_TLD_AUTHORITY = new PublicKey(
//     '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
// )

// export async function findOwnedNameAccountsForUser(
//     userAccount: PublicKey
// ): Promise<PublicKey[]> {
//     const connection = new Connection(clusterApiUrl('mainnet-beta'))
//     const filters = [
//         {
//             memcmp: {
//                 offset: 32,
//                 bytes: userAccount.toBase58(),
//             },
//         },
//         {
//             memcmp: {
//                 offset: 0,
//                 bytes: SOL_TLD_AUTHORITY.toBase58(),
//             },
//         },
//     ]
//     const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
//         filters,
//     })
//     return accounts.map((a) => a.pubkey)
// }

// console.log(address)
const resolveDomains = async (chain: Chain, address: string | null) => {
    // setDomain({ domain: null, loading: true })
    try {
        if (address !== null) {
            if (chain === 'POLYGON') {
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
                console.log(accounts)
                if (accounts.length > 0) {
                    return { domain: accounts[0].name, loading: false }
                } else {
                    return { domain: null, loading: false }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default resolveDomains
