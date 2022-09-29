import { Box, useDisclosure } from '@chakra-ui/react'
import type { NextPage } from 'next'
import FeaturedEvents from '../layouts/LandingPage/FeaturedEvents.layout'
import HeroCTA from '../layouts/LandingPage/HeroCTA.layout'
import Head from 'next/head'
import { useEffect } from 'react'
declare const window: any
const Home: NextPage = () => {
    const {
        isOpen: isOpen3,
        onOpen: onOpen3,
        onClose: onClose3,
    } = useDisclosure()

    return (
        <Box h="100vh" overflow="scroll">
            <Head>
                {' '}
                <meta
                    name="twitter:image"
                    content={
                        'https://res.cloudinary.com/dev-connect/image/upload/v1645093690/img/embed_wqfswz.webp'
                    }
                />
                <title>MetaPass | Reimagining Events</title>
                <meta
                    name="description"
                    content="Book NFT tickets for online and IRL events"
                ></meta>
                <meta
                    property="og:title"
                    content="MetaPass - Reimagining Events"
                />
                <meta property="og:url" content="https://app.metapasshq.xyz" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@metapasshq" />
                <meta
                    name="twitter:title"
                    content="MetaPass - Reimagining Events"
                />
                <meta name="twitter:creator" content="@metapasshq" />
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
            <HeroCTA isOpen3={isOpen3} onOpen3={onOpen3} onClose3={onClose3} />
            <Box p={{ md: '2' }} />
            <FeaturedEvents />
        </Box>
    )
}

export default Home
