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
} from '@chakra-ui/react'

import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'

import { auth } from '../../utils/firebaseUtils'
import {
    signInWithRedirect,
    GoogleAuthProvider,
    GithubAuthProvider,
} from 'firebase/auth'
import type { AuthProvider } from 'firebase/auth'

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()

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
                        gap="4"
                        pb="8"
                    >
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
                        <Button
                            w="72"
                            variant="outline"
                            gap="2"
                            _focus={{}}
                            onClick={() => signUp(githubProvider)}
                        >
                            <AiFillGithub size={25} />
                            Sign Up with GitHub
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SignUpModal
