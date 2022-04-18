import type { NextComponentType, NextPageContext } from 'next'
import type { ModalProps } from '../../types/AuthModal.types'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Input,
    Text,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react'

import { FcGoogle } from 'react-icons/fc'
import { MdMail } from 'react-icons/md'

import { auth } from '../../utils/firebaseUtils'
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth'
import type { AuthProvider } from 'firebase/auth'

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const googleProvider = new GoogleAuthProvider()

    const signUp = (provider: AuthProvider) => {
        signInWithRedirect(auth, provider)
    }

    return (
        <>
            <Modal isOpen onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Get Started</ModalHeader>
                    <ModalCloseButton _focus={{}} />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3"
                        pb="8"
                    >
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="center"
                            alignItems="center"
                            gap="3"
                        >
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={
                                        <MdMail size="20" color="gray.700" />
                                    }
                                />
                                <Input
                                    type="email"
                                    placeholder="enter your email"
                                    w="xs"
                                    fontWeight="500"
                                    textColor="gray.700"
                                    focusBorderColor="purple.500"
                                    _placeholder={{
                                        color: 'gray.600',
                                        fontWeight: '500',
                                    }}
                                />
                            </InputGroup>

                            <Button colorScheme="purple" _focus={{}}>
                                continue
                            </Button>
                        </Box>

                        <Text
                            fontFamily="heading"
                            fontWeight="500"
                            fontSize="xl"
                        >
                            or
                        </Text>
                        <Button
                            w="72"
                            variant="outline"
                            gap="2"
                            _focus={{}}
                            onClick={() => signUp(googleProvider)}
                        >
                            <FcGoogle size={25} />
                            Sign Up with Google
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SignUpModal
