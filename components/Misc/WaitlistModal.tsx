import {
    Button,
    Image,
    Text,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    useDisclosure,
    Heading,
} from '@chakra-ui/react'
import { EmailBar } from '../../layouts/LandingPage/FeaturedEvents.layout'
import { Dispatch, SetStateAction } from 'react'
import { IoIosAdd } from 'react-icons/io'
const WaitlistModal = ({
    email,
    setEmail,
    mode,
}: {
    email: string
    setEmail: Dispatch<SetStateAction<string>>
    mode: string
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button
                pl="1"
                rounded="full"
                bg={mode === 'white' ? 'blackAlpha.100' : 'whiteAlpha.800'}
                color="blackAlpha.700"
                fontWeight="medium"
                _hover={{
                    shadow: 'sm',
                    bg: mode === 'white' ? 'blackAlpha.50' : 'white',
                }}
                border="2px"
                onClick={onOpen}
                borderColor={mode === 'white' ? 'blackAlpha.100' : 'white'}
                _focus={{}}
                _active={{ transform: 'scale(0.95)' }}
                role="group"
                leftIcon={
                    <Flex
                        _groupHover={{
                            transform: 'scale(1.05)',
                        }}
                        transitionDuration="200ms"
                        justify="center"
                        alignItems="center"
                        color="white"
                        bg="brand.gradient"
                        rounded="full"
                        p="0.5"
                    >
                        <IoIosAdd size="25px" />
                    </Flex>
                }
            >
                Create Event
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent rounded="2xl">
                    <Flex justify="center">
                        <Image
                            src="/assets/elements/bolt.png"
                            maxH="20"
                            maxW="20"
                            pos="absolute"
                            // skewY="50px"
                            zIndex="overlay"
                            top="-10"
                            //   left="250"
                            alt="bolt"
                        />
                    </Flex>
                    <ModalBody
                        //   borderRadius="xl"
                        p="10"
                    >
                        <Flex flexDir="column" justify="center" align="center">
                            <Heading
                                fontFamily="azonix"
                                textAlign="center"
                                //  fontFamily="azonix"
                                fontSize={{
                                    base: '3xl',
                                    lg: '3xl',
                                    xl: '3xl',
                                }}
                            >
                                JOIN THE WAITLIST
                            </Heading>
                            <Text
                                m="4"
                                p="4"
                                lineHeight="23.72px"
                                letterSpacing="3%"
                                fontFamily="Product Sans"
                                fontSize="18px"
                                color="rgba(0, 0, 0, 0.31)"
                                maxW="500px"
                                height="63.08px"
                                fontWeight="400"

                                //  noOfLines={4}
                            >
                                We&apos;re on the mission to revolutionize event
                                ticketing with blockchain, join the waitlist and
                                lets band together on this journey! 🚀
                            </Text>
                            <EmailBar
                                email={email}
                                setEmail={setEmail}
                                onClose={onClose}
                            />
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default WaitlistModal
