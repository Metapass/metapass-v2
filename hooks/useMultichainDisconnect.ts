import { useWallet } from '@solana/wallet-adapter-react'

// import { useEffect, useState, useCallback } from 'react'
import { useDisconnect } from 'wagmi'
import { Chain } from '../types/blockchain.types'

const useMultichainDisconnect = (chain: Chain | null) => {
    let { disconnect: evmDisconnect } = useDisconnect()
    let { disconnect: solDisconnect } = useWallet()

    let disconnector = null
    const multichainDisconnector = async () => {
        if (chain) {
            if (chain === 'POLYGON') {
                evmDisconnect()
            }
            if (chain === 'SOL') {
                await solDisconnect()
            }
        } else {
            disconnector = null
        }
    }

    return { multichainDisconnector }
}
export default useMultichainDisconnect
