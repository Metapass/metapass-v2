import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import FeaturedEvents from '../layouts/LandingPage/FeaturedEvents.layout'
import HeroCTA from '../layouts/LandingPage/HeroCTA.layout'

const Home: NextPage = () => {
    return (
        <Box minH="100vh" h="full" overflow="hidden">
            <HeroCTA />
            <Box p={{ md: '2' }} />
            <FeaturedEvents />
        </Box>
    )
}

export default Home
