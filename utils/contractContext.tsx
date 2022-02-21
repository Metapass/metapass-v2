import React, { useContext, createContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { web3Context } from './web3Context'
import { walletContext } from './walletContext'
import abi from './MetapassFactory.json'

declare const window: any

export const contractContext: any = createContext([])

function Contract({ children }: any) {
    const [web3] = useContext(web3Context)
    const contractAddress = process.env.NEXT_PUBLIC_ENV === 'dev'?process.env.NEXT_PUBLIC_FACTORY_ADDRESS:process.env.NEXT_PUBLIC_FACTORY_ADDRESS_MAINNET
    
    const [factoryContract, setFactoryContract]: any = useState(undefined)

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            let contract = new ethers.Contract(
                contractAddress as string,
                abi.abi,
                signer
            )
            setFactoryContract(contract)
        }
    }, [])

    return (
        <contractContext.Provider value={[factoryContract]}>
            {children}
        </contractContext.Provider>
    )
}

export default Contract
