import type { NextComponentType, NextPageContext } from 'next'
import type { ModalProps } from '../../types/AuthModal.types'
import { useState } from 'react'
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
    useToast,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { MdMail } from 'react-icons/md'
import { auth } from '../../utils/firebaseUtils'
import {
    signInWithPopup,
    GoogleAuthProvider,
    sendSignInLinkToEmail,
} from 'firebase/auth'
import type { AuthProvider } from 'firebase/auth'

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const toast = useToast()
    const [email, setEmail] = useState<string>('')
    const googleProvider = new GoogleAuthProvider()

    const signUp = (provider: AuthProvider) => {
        signInWithPopup(auth, provider).then((user) => {
            onClose()
        })
    }

    const actionCodeSettings = {
        url: 'https://app.metapasshq.xyz/',
        handleCodeInApp: true,
    }

    const sendEmailLink = () => {
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                window.localStorage.setItem('emailForSignIn', email)

                toast({
                    title: 'SignIn Link Sent.',
                    description:
                        'Please check your email for the link to sign in.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })

                onClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                                <InputLeftElement pointerEvents="none">
                                    <MdMail size="22" color="gray.700" />
                                </InputLeftElement>
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
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value as string)
                                    }
                                />
                            </InputGroup>

                            <Button
                                colorScheme="purple"
                                _focus={{}}
                                onClick={sendEmailLink}
                                isDisabled={email === '' && true}
                            >
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
                            sign up with google
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SignUpModal
