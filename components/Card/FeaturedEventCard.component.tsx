import {
    AspectRatio,
    Box,
    Flex,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import EventLayout from '../../layouts/Event/Event.layout'
import { Event } from '../../types/Event.type'
import { users } from '../../utils/testData'

export default function FeaturedEventCard({ event }: { event: Event }) {
    const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ]

    const [showEventModal, setEventModal] = useState(false)

    return (
        <Flex
            rounded="lg"
            overflow="hidden"
            bg="white"
            onClick={() => {
                setEventModal(true)
            }}
            _hover={{ transform: 'scale(1.01)' }}
            _active={{ transform: 'scale(1.03)' }}
            transitionDuration="200ms"
            cursor="pointer"
            boxShadow="0px -4px 52px rgba(0, 0, 0, 0.11)"
            w={{ base: '540px', lg: '480px', xl: '610px' }}
            h="full"
            border="1px"
            position="relative"
            borderColor="blackAlpha.200"
        >
            {showEventModal && (
                <Modal
                    isCentered
                    size="5xl"
                    isOpen={showEventModal}
                    onClose={() => {
                        setEventModal(false)
                    }}
                >
                    <ModalOverlay />

                    <ModalContent rounded={{ base: 'none', lg: 'xl' }}>
                        <ModalCloseButton
                            bg="white"
                            roundedRight="full"
                            _focus={{}}
                            _active={{}}
                            zIndex={9999}
                            _hover={{ color: 'brand.peach' }}
                            top="2"
                            right="-6"
                        />
                        <ModalBody>
                            <EventLayout event={event} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            <Flex
                zIndex={2}
                rounded="full"
                fontSize="10px"
                fontWeight="semibold"
                px="2"
                justify="center"
                alignItems="center"
                experimental_spaceX="1"
                py="0.5"
                bg="white"
                position="absolute"
                bottom="2"
                left="2"
                color="blackAlpha.700"
            >
                {event.price === 0 ? (
                    <>FREE</>
                ) : (
                    <>
                        <Image
                            src="/assets/matic_logo.svg"
                            w="3"
                            filter="brightness(0%)"
                            alt="matic"
                        />
                        <Text> {event.price}</Text>
                    </>
                )}
            </Flex>
            <Flex
                zIndex={2}
                rounded="full"
                fontSize="10px"
                fontWeight="medium"
                pr="2"
                pl="0.5"
                justify="center"
                alignItems="center"
                experimental_spaceX="1"
                py="0.5"
                bg="white"
                position="absolute"
                top="2"
                left="2"
                color="blackAlpha.700"
            >
                <Flex
                    p="1"
                    alignItems="center"
                    justify="center"
                    bg="brand.gradient"
                    rounded="full"
                    color="white"
                    fontSize="10px"
                >
                    <FaStar />
                </Flex>
                <Text> Featured</Text>
            </Flex>
            <AspectRatio
                ratio={299 / 210}
                w="full"
                maxW={{ base: '200px', xl: '240px' }}
            >{/* 
            // @ts-ignore */}
                <Image w="full" src={event.image.hero_image || event.image.image || event.image.display} alt="event image" />
            </AspectRatio>

            <Flex direction="column" justify="space-between" w="full">
                <Flex
                    p={{ base: '3', xl: '4' }}
                    alignItems="center"
                    w="full"
                    justify="space-between"
                >
                    <Box pl="2" pr="4">
                        <Flex
                            experimental_spaceX="2"
                            color="blackAlpha.600"
                            mb="2"
                            ml="-1"
                        >
                            <Box
                                boxShadow="0px 2px 27.5323px rgba(0, 0, 0, 0.06)"
                                border="1px"
                                borderColor="blackAlpha.200"
                                rounded="full"
                                fontSize="10px"
                                fontWeight="semibold"
                                px="2"
                                py="0.5"
                                bg="white"
                            >
                                {event.type}
                            </Box>
                            <Box
                                boxShadow="0px 2px 27.5323px rgba(0, 0, 0, 0.06)"
                                border="1px"
                                borderColor="blackAlpha.200"
                                rounded="full"
                                fontSize="10px"
                                fontWeight="semibold"
                                px="2"
                                py="0.5"
                                bg="white"
                            >
                                {event.category}
                            </Box>
                        </Flex>
                        <Text
                            fontSize={{ base: 'sm', xl: 'lg' }}
                            fontWeight="semibold"
                            color="brand.black600"
                            noOfLines={2}
                        >
                            {event.title}
                        </Text>
                        <Flex
                            color="blackAlpha.700"
                            fontSize={{ base: '10px', xl: 'xs' }}
                            experimental_spaceX="1"
                        >
                            <Text>by</Text>
                            <Link
                                fontWeight="medium"
                                noOfLines={1}
                                _hover={{ color: 'brand.black600' }}
                            >
                                {event.owner.substring(0, 6) +
                                    '...' +
                                    event.owner.substring(
                                        event.owner.length - 6
                                    ) || 'Anonymous'}
                            </Link>
                        </Flex>
                        <Text
                            mt="1"
                            color="blackAlpha.500"
                            fontFamily="body"
                            fontSize={{ base: 'xs', xl: 'sm' }}
                            noOfLines={2}
                        >
                            {event.description}
                        </Text>
                    </Box>
                    <Box
                        textAlign="center"
                        borderLeft="2px"
                        borderColor="blackAlpha.200"
                        pl="5"
                        h="fit-content"
                        mr="6"
                    >
                        <Text
                            fontSize={{ base: 'xs', xl: 'sm' }}
                            fontFamily="body"
                            fontWeight="bold"
                            color="brand.peach"
                        >
                            {months[new Date(event.date).getMonth()]}
                        </Text>
                        <Text
                            fontSize={{ base: 'lg', xl: 'xl' }}
                            color="brand.black600"
                            fontWeight="medium"
                        >
                            {new Date(event.date).getDate()}
                        </Text>
                    </Box>
                </Flex>
                <Box>
                    <Flex justify="end">
                        <Box
                            bg="white"
                            rounded="full"
                            p="1"
                            px="3"
                            roundedRight="none"
                            transform="translateY(-4px)"
                            w="fit-content"
                            fontSize={{ base: 'xx-small', xl: 'xs' }}
                            boxShadow="0px 6.36032px 39.752px rgba(0, 0, 0, 0.07)"
                        >
                            {event.tickets_available - event.tickets_sold >
                            0 ? (
                                <Flex experimental_spaceX="1">
                                    <Text
                                        fontWeight="bold"
                                        style={{
                                            background:
                                                '-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {event.tickets_available -
                                            event.tickets_sold}
                                        /{event.tickets_available}
                                    </Text>
                                    <Text color="blackAlpha.500">
                                        Tickets Sold
                                    </Text>
                                </Flex>
                            ) : (
                                <Flex align="center" experimental_spaceX="1">
                                    <Flex
                                        color="white"
                                        ml="-1.5"
                                        bg="brand.gradient"
                                        rounded="full"
                                        p="1"
                                        justify="center"
                                        align="center"
                                    >
                                        <FaStar />
                                    </Flex>
                                    <Text
                                        color="blackAlpha.500"
                                        fontWeight="bold"
                                        style={{
                                            background:
                                                '-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        SOLD OUT!
                                    </Text>
                                </Flex>
                            )}
                        </Box>
                    </Flex>
                    <Box w="full" h="5" bg="blackAlpha.50" mt="-4">
                        <Box
                            w={`${
                                (event.tickets_sold / event.tickets_available) *
                                100
                            }%`}
                            h="full"
                            bg="brand.gradient"
                        />
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}
