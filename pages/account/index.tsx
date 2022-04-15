import type { NextPage } from 'next'
import { useContext, useState } from 'react'

import {
    Box,
    Image,
    useDisclosure,
    Text,
    Center,
    Button,
    Divider,
} from '@chakra-ui/react'
import { SignUpModal, HeroSection } from '../../components'
import EventCard from '../../components/Card/EventCard.component'

import { auth } from '../../utils/firebaseUtils'
import { onAuthStateChanged } from 'firebase/auth'

const Account: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user, setUser] = useState<any>()

    console.log(user)

    onAuthStateChanged(auth, (user) => {
        user ? setUser(user) : setUser(null)
    })

    return (
        <Box display="flex" flexDir="column">
            {!user && (
                <SignUpModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            )}

            <HeroSection />
            <Center>
                <Image
                    src={user?.photoURL}
                    height="32"
                    width="32"
                    rounded="full"
                    border="solid 5px white"
                    marginTop="-16"
                />
            </Center>

            <Box display="flex" flexDir="column" textAlign="center" gap="1">
                <Text fontSize="3xl" fontFamily="heading" fontWeight="600">
                    {user?.displayName}
                </Text>
                <Text
                    fontFamily="body"
                    fontSize="lg"
                    fontWeight="medium"
                    textColor="#0000004A"
                >
                    0x4e69...09e2
                </Text>
                <Text
                    fontFamily="heading"
                    textColor="#00000069"
                    fontWeight="medium"
                >
                    17 | Product Designer & Part-time Ninja
                </Text>
                <Center>
                    <Button
                        mt="3"
                        fontFamily="heading"
                        fontWeight="500"
                        variant="outline"
                        rounded="full"
                        borderWidth="2px"
                        h="9"
                        _focus={{}}
                    >
                        Manage Events
                    </Button>
                </Center>
            </Box>

            <Center>
                <Box
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    fontFamily="heading"
                    fontSize="lg"
                    fontWeight="500"
                    textColor="gray.500"
                    gap="4"
                    px="3"
                    rounded="full"
                    h="10"
                    mt="6"
                    border="solid 2px gray.500"
                >
                    <Text
                        cursor="pointer"
                        _hover={{ textColor: 'gray.700' }}
                        transitionDuration="100ms"
                    >
                        Events Created
                    </Text>
                    <Box
                        h="80%"
                        w="2px"
                        bgColor="gray.300"
                        rounded="full"
                    ></Box>
                    <Text
                        cursor="pointer"
                        _hover={{ textColor: 'gray.700' }}
                        transitionDuration="100ms"
                    >
                        Events Attended
                    </Text>
                </Box>
            </Center>

            <Box px="32" mt="8">
                <Text fontSize="3xl" fontFamily="poppins" fontWeight="500">
                    Events Attended
                </Text>

            </Box>
        </Box>
    )
}

export default Account
