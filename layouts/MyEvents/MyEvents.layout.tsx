import {
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    Image,
    Tabs,
    TabList,
    Tab,
    Box,
    TabPanels,
    TabPanel,
    Grid,
} from '@chakra-ui/react'
import { useState } from 'react'
import EventCard from '../../components/Card/EventCard.component'
import { events } from '../../utils/testData'

export default function MyEvents({ isOpen, onClose }: any) {
    const [tab, setTab] = useState('upcoming')

    return (
        <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent rounded="2xl">
                <ModalBody>
                    <Flex
                        justify="center"
                        w="full"
                        textAlign="center"
                        mt="8"
                        mb="8"
                        direction="column"
                    >
                        <Flex justify="center" mb="4">
                            <Text
                                fontWeight="medium"
                                color="brand.black"
                                fontSize="xl"
                                position="relative"
                            >
                                My Events
                            </Text>
                            <Image
                                w="4"
                                mt="-8"
                                src="/assets/elements/sparkle_dark.svg"
                                alt="element"
                            />
                        </Flex>
                        <Flex w="full" justify="center">
                            <Tabs
                                mt="4"
                                align="center"
                                w="fit-content"
                                variant="unstyled"
                            >
                                <TabList
                                    px="2"
                                    bg="white"
                                    w="fit-content"
                                    boxShadow="0px 13px 101px rgba(0, 0, 0, 0.08)"
                                    rounded="full"
                                    border="1px"
                                    borderColor="blackAlpha.100"
                                >
                                    <Tab
                                        pb="0"
                                        display="flex"
                                        flexDirection="column"
                                        _focus={{}}
                                        onFocus={() => {
                                            setTab('upcoming')
                                        }}
                                        _hover={{
                                            color:
                                                tab !== 'upcoming' &&
                                                'blackAlpha.600',
                                        }}
                                        _active={{}}
                                        fontWeight={
                                            tab === 'upcoming'
                                                ? 'medium'
                                                : 'normal'
                                        }
                                        color={
                                            tab === 'upcoming'
                                                ? 'brand.black600'
                                                : 'blackAlpha.500'
                                        }
                                    >
                                        <Text mb="2">Upcoming Events</Text>
                                        {tab === 'upcoming' && (
                                            <Box
                                                w="full"
                                                h="1"
                                                bg="brand.gradient"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        pb="0"
                                        display="flex"
                                        flexDirection="column"
                                        _focus={{}}
                                        _active={{}}
                                        onFocus={() => {
                                            setTab('past')
                                        }}
                                        fontWeight={
                                            tab === 'past' ? 'medium' : 'normal'
                                        }
                                        _hover={{
                                            color:
                                                tab !== 'past' &&
                                                'blackAlpha.600',
                                        }}
                                        color={
                                            tab === 'past'
                                                ? 'brand.black600'
                                                : 'blackAlpha.500'
                                        }
                                    >
                                        <Text mb="2">Past Events</Text>
                                        {tab === 'past' && (
                                            <Box
                                                w="full"
                                                h="1"
                                                bg="brand.gradient"
                                            />
                                        )}
                                    </Tab>
                                </TabList>
                                <TabPanels mt="10">
                                    <TabPanel>
                                        <Grid
                                            templateColumns={{
                                                md: 'repeat(2, 1fr)',
                                                lg: 'repeat(2, 1fr)',
                                                xl: 'repeat(2, 1fr)',
                                            }}
                                            px={{ base: '6', md: '10' }}
                                            gap={6}
                                        >
                                            {events.map((data, key) => (
                                                <Box
                                                    maxW={{ xl: '390px' }}
                                                    minW={{ xl: '390px' }}
                                                    key={key}
                                                >
                                                    <EventCard event={data} />
                                                </Box>
                                            ))}
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel>
                                        <Grid
                                            templateColumns={{
                                                md: 'repeat(2, 1fr)',
                                                lg: 'repeat(2, 1fr)',
                                                xl: 'repeat(2, 1fr)',
                                            }}
                                            px={{ base: '6', md: '10' }}
                                            gap={6}
                                        >
                                            {events
                                                .reverse()
                                                .map((data, key) => (
                                                    <Box
                                                        maxW={{ xl: '390px' }}
                                                        minW={{ xl: '390px' }}
                                                        key={key}
                                                    >
                                                        <EventCard
                                                            event={data}
                                                        />
                                                    </Box>
                                                ))}
                                        </Grid>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
