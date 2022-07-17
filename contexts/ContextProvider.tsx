import toast from 'react-hot-toast'
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import {
    ConnectionProvider,
    WalletProvider,
    useWallet,
} from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    GlowWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import {
    WalletModalProvider,
    useWalletModal,
} from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { AutoConnectProvider } from './AutoConnextProvider'
import { clusterApiUrl } from '@solana/web3.js'
// import { AutoConnectProvider } from './AutoConnextProvider'

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletContextProvider: FC = ({ children }) => {
    // If window exists and is on localhost, choose devnet, else choose mainnet
    const network =
        typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENV === 'dev'
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Mainnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
            new GlowWalletAdapter(),
        ],
        [network]
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <AutoConnectProvider>
            <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
    )
}
