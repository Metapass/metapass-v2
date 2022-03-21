import { Box, Flex, Grid } from '@chakra-ui/react'
import EventCard from '../../components/Card/EventCard.component'
import FeaturedEventCard from '../../components/Card/FeaturedEventCard.component'
import { events } from '../../utils/testData'
import axios from 'axios'
import { useEffect } from 'react'
export default function FeaturedEvents() {
    return (
        <Box>
            <Flex
                justify="center"
                alignItems="center"
                wrap="wrap"
                mr="6"
                display={{ base: 'none', md: 'flex', lg: 'none', xl: 'flex' }}
            >
                {events.slice(0, 2).map((data, key) => (
                    <Flex ml="6" mb="6" key={key} justify="center">
                        <FeaturedEventCard event={data} />
                    </Flex>
                ))}
            </Flex>

            <Flex
                justify="center"
                alignItems="center"
                wrap="wrap"
                mr="6"
                display={{ base: 'flex', md: 'none', lg: 'flex', xl: 'none' }}
            >
                {events.slice(0, 2).map((data, key) => (
                    <Box ml="6" mb="6" w="360px" h="full" key={key}>
                        <EventCard isFeatured event={data} />
                    </Box>
                ))}
            </Flex>
        </Box>
    )
}
