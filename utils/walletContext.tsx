import React, { useState, createContext } from 'react'
import { Chain } from '../types/blockchain.types'
export const walletContext: any = createContext([])
export type WalletType = {
    balance: string | null
    address: string | null
    domain: string | null
    type: 'mm' | 'wc' | 'sol' | 'web3auth' | null
    chain: Chain | null
}
function Wallet({ children }: any) {
    const [wallet, setWallet] = useState<WalletType>({
        balance: null,
        address: null,
        domain: null,
        type: null,
        chain: null,
    })

    return (
        <walletContext.Provider value={[wallet, setWallet]}>
            {children}
        </walletContext.Provider>
    )
}

export default Wallet
