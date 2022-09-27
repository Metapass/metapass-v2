import React, { useState, createContext } from 'react'

export const web3Context: any = createContext([])

function Web3Wrapper({ children }: any) {
    const [web3, setWeb3] = useState()
    const [web3auth, setWeb3auth] = useState()
    return (
        <web3Context.Provider value={[web3, setWeb3, web3auth, setWeb3auth]}>
            {children}
        </web3Context.Provider>
    )
}

export default Web3Wrapper
