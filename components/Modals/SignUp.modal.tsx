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
    Flex,
    Image,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../../lib/config/supabaseConfig'
import { motion } from 'framer-motion'

const SignUpModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    const user = supabase.auth.user()
    console.log(user)

    const signIn = async (provider: 'google' | 'twitter') => {
        const { user, session, error } = await supabase.auth.signIn({
            provider: provider,
        })
    }

    return (
        <>
            <Modal isOpen onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    as={motion.div}
                    initial={{
                        opacity: 0,
                        y: -200,
                    }}
                >
                    <Flex justify="center">
                        <Image
                            src="/assets/bolt.svg"
                            maxH="28"
                            maxW="28"
                            pos="absolute"
                            zIndex="overlay"
                            top="-14"
                            alt="bolt"
                        />
                    </Flex>

                    <ModalHeader textAlign="center" mt="8">
                        Get Started
                    </ModalHeader>
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
                            onClick={() => signIn('google')}
                        >
                            <FcGoogle size={25} />
                            Continue with google
                        </Button>
                        <Text
                            fontFamily="heading"
                            fontWeight="500"
                            fontSize="xl"
                        >
                            or
                        </Text>
                        <Button w="72" variant="outline" gap="2" _focus={{}}>
                            <Image
                                src="/assets/twitter.svg"
                                alt="twtr icon"
                                height="5"
                                width="5"
                                onClick={() => signIn('twitter')}
                            />
                            Continue with Twitter
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SignUpModal
