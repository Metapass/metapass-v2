import React, { useState, createContext } from 'react'

export const walletContext: any = createContext([])

function Wallet({ children }: any) {
    const [wallet, setWallet] = useState({
        balance: null,
        address: null,
    })

    return (
        <walletContext.Provider value={[wallet, setWallet]}>
            {children}
        </walletContext.Provider>
    )
}

export default Wallet
