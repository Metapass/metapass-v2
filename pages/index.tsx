import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import FeaturedEvents from '../layouts/LandingPage/FeaturedEvents.layout'
import HeroCTA from '../layouts/LandingPage/HeroCTA.layout'

const Home: NextPage = () => {
    return (
        <Box h="100vh" overflow="scroll">
            <HeroCTA />
            <Box p={{ md: '2' }} />
            <FeaturedEvents />
        </Box>
    )
}

export default Home
