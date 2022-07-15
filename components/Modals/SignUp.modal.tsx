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
    Text,
    Image,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { auth } from '../../utils/firebaseUtils'
import {
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithRedirect,
} from 'firebase/auth'
import type { AuthProvider } from 'firebase/auth'

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const googleProvider = new GoogleAuthProvider()
    const twitterProvider = new TwitterAuthProvider()

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
                        <Button
                            w="72"
                            variant="outline"
                            gap="2"
                            _focus={{}}
                            onClick={() => signUp(twitterProvider)}
                        >
                            <Image
                                src="/assets/twitter.svg"
                                alt="twtr icon"
                                height="5"
                                width="5"
                            />
                            Sign up with twitter
                        </Button>
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
                            Sign up with google
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SignUpModal
