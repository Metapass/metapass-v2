import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from './../styles/theme.chakra'
import Head from 'next/head'
import PageLayout from '../components/Wrappers/PageLayout.component'
import Wallet from '../utils/walletContext'
import Web3Wrapper from '../utils/web3Context'
import { Toaster } from 'react-hot-toast'
import Contract from '../utils/contractContext'
import Script from 'next/script'

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
            <Head>
                <title>MetaPass | Reimagining Events</title>
                <meta
                    name="description"
                    content="Book NFT tickets for online and IRL events"
                ></meta>
                <meta
                    property="og:title"
                    content="MetaPass - Reimagining Events"
                />
                <meta property="og:url" content="https://metapasshq.xyz" />
                <meta property="og:image" content="assets/embed.png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@metapasshq" />
                <meta
                    name="twitter:title"
                    content="MetaPass - Reimagining Events"
                />
                <meta name="twitter:creator" content="@metapasshq" />
                <meta
                    name="twitter:image"
                    content="https://res.cloudinary.com/dev-connect/image/upload/v1645093690/img/embed_wqfswz.webp"
                />
                <meta
                    name="twitter:description"
                    content="Book NFT tickets for online and IRL events"
                />
                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta
                    property="og:description"
                    content="Book NFT tickets for online and IRL events"
                />
            </Head>

            <Wallet>
                <Web3Wrapper>
                    <Contract>
                        <Toaster />
                        <ChakraProvider theme={theme}>
                            <Component {...pageProps} />
                        </ChakraProvider>
                    </Contract>
                </Web3Wrapper>
            </Wallet>
        </>
    )
}

export default MyApp
