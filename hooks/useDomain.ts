import { ethers } from 'ethers'
import { useState, useEffect, useCallback } from 'react'
import { Chain } from '../types/blockchain.types'
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js'
import {
    performReverseLookup,
    NAME_PROGRAM_ID,
} from '@bonfida/spl-name-service'
declare const window: any
const SOL_TLD_AUTHORITY = new PublicKey(
    '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
)

export async function findOwnedNameAccountsForUser(
    userAccount: PublicKey
): Promise<PublicKey[]> {
    const connection = new Connection(clusterApiUrl('mainnet-beta'))
    const filters = [
        {
            memcmp: {
                offset: 32,
                bytes: userAccount.toBase58(),
            },
        },
        {
            memcmp: {
                offset: 0,
                bytes: SOL_TLD_AUTHORITY.toBase58(),
            },
        },
    ]
    const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
        filters,
    })
    return accounts.map((a) => a.pubkey)
}
export function useDomain(chain: Chain, address: string | null) {
    const [domain, setDomain] = useState<{
        domain: string | null
        loading: boolean
    } | null>(null)

    // console.log(address)
    const resolveDomains = async () => {
        setDomain({ domain: null, loading: true })
        try {
            if (address !== null) {
                if (chain === 'POLYGON') {
                    if (!window.ethereum || !address) return
                    const provider = new ethers.providers.AlchemyProvider()
                    const ethdomain = await provider.lookupAddress(address)
                    ethdomain &&
                        setDomain({ domain: ethdomain, loading: false })
                } else if (chain === 'SOL') {
                    if (!window.solana || !address) return
                    const publicKey = new PublicKey(address)
                    // console.log('publicKey', publicKey.toBase58())
                    const connection = new Connection(
                        clusterApiUrl('mainnet-beta')
                    )
                    const accounts = await findOwnedNameAccountsForUser(
                        publicKey
                    )
                    // console.log('accounts', accounts)
                    if (accounts.length > 0) {
                        const soldomain = await performReverseLookup(
                            connection,
                            accounts[0]
                        )
                        console.log('domain', soldomain)
                        setDomain({ domain: soldomain, loading: false })
                    } else {
                        setDomain({ domain: null, loading: false })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        resolveDomains()
    }, [chain, address])
    // console.log('domain return', domain?.domain, domain?.loading)
    return [domain?.domain]
}
