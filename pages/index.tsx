import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import FeaturedEvents from '../layouts/LandingPage/FeaturedEvents.layout'
import HeroCTA from '../layouts/LandingPage/HeroCTA.layout'
import Head from 'next/head'

const Home: NextPage = () => {
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
            </Head>
            <HeroCTA />
            <Box p={{ md: '2' }} />
            <FeaturedEvents />
        </Box>
    )
}

export default Home
