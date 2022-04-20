import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
    Box,
    Image,
    useDisclosure,
    Text,
    Center,
    Button,
    Flex,
    useToast,
} from '@chakra-ui/react'
import { SignUpModal, HeroSection, UpdateProfileModal } from '../../components'
import { HiPencil } from 'react-icons/hi'

import { auth } from '../../utils/firebaseUtils'
import {
    onAuthStateChanged,
    isSignInWithEmailLink,
    signInWithEmailLink,
} from 'firebase/auth'

const Account: NextPage = () => {
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpen2,
        onOpen: onOpen2,
        onClose: onClose2,
    } = useDisclosure()
    const [user, setUser] = useState<any>()
    const toast = useToast()

    onAuthStateChanged(auth, (user) => {
        user ? setUser(user) : setUser(null)
    })

    useEffect(() => {
        if (typeof window !== undefined) {
            if (isSignInWithEmailLink(auth, window.location.href!)) {
                let email = window.localStorage.getItem('emailForSignIn')
                if (!email) {
                    toast({
                        title: 'Error.',
                        description: 'email not found',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    })
                }
                signInWithEmailLink(auth, email as string, window.location.href)
                    .then((result) => {
                        window?.localStorage.removeItem('emailForSignIn')
                    })
                    .catch((error) => {})
            }
        }
    }, [])

    // useEffect(() => {
    //     if (user) {
    //         let { event_id } = router.query

    //         event_id ? router.push(`event/${event_id}`) : null
    //     }
    // }, [user])

    return (
        <Box display="flex" flexDir="column">
            {user === null && (
                <SignUpModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            )}
            <UpdateProfileModal
                isOpen={isOpen2}
                onOpen={onOpen2}
                onClose={onClose2}
            />
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
                <Flex gap="2" justifyContent="center" alignItems="center">
                    <Text fontSize="3xl" fontFamily="heading" fontWeight="600">
                        {user?.displayName}
                    </Text>

                    <Box
                        display="grid"
                        placeItems="center"
                        h="10"
                        w="10"
                        rounded="full"
                        cursor="pointer"
                        onClick={onOpen2}
                        _hover={{ bgColor: 'gray.100' }}
                        transition="all"
                        transitionDuration="100ms"
                    >
                        <HiPencil size="20" />
                    </Box>
                </Flex>

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
                    px="6"
                    rounded="full"
                    h="10"
                    mt="6"
                    boxShadow="0px 15px 105px 0px #0000000F"
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
