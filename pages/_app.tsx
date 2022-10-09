import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Wallet from '../utils/walletContext'
import Web3Wrapper from '../utils/web3Context'
import { Toaster } from 'react-hot-toast'
import Contract from '../utils/contractContext'
import Script from 'next/script'
import { ContextProvider } from '../contexts/ContextProvider'
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { RecoilRoot } from 'recoil'
import dynamic from 'next/dynamic'
import ChatwootWidget from '../components/Elements/Chatwoot.component'
import NextNProgress from 'nextjs-progressbar'
const Chakra = dynamic(() => import('../components/Root/Chakra.root'))

const { chains, provider, webSocketProvider } = configureChains(
    [chain.polygon, chain.polygonMumbai],
    [publicProvider()]
)

const client = createClient({
    autoConnect: false,
    provider,
    webSocketProvider,
})
declare const window: any
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Script
                async
                src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.1/dist/umd/index.min.js"
            />
            <Script
                async
                src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
            />
            <Script
                async
                defer
                data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
                src="https://analytics.metapasshq.xyz/umami.js"
            />
            <script src="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js"></script>
            <link
                href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
                rel="stylesheet"
            />

            <RecoilRoot>
                <Wallet>
                    <WagmiConfig client={client}>
                        <Web3Wrapper>
                            <ContextProvider>
                                <Contract>
                                    <Toaster />
                                    <Chakra
                                        Component={Component}
                                        pageProps={pageProps}
                                    >
                                        {' '}
                                        {<ChatwootWidget />}
                                        <NextNProgress color="#6451FB" />
                                    </Chakra>
                                </Contract>
                            </ContextProvider>
                        </Web3Wrapper>
                    </WagmiConfig>
                </Wallet>
            </RecoilRoot>
        </>
    )
}

export default MyApp
