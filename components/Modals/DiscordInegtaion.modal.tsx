import {
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    Button,
    Select,
} from '@chakra-ui/react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'

const DiscordModal = ({ isOpen, onOpen, onClose }: ModalProps) => {
    const user = supabase.auth.user()

    const [isDiscordAuth, setIsDiscordAuth] = useState(false)

    useEffect(() => {
        if (user) {
            user.app_metadata.providers.map((p: string) => {
                if (p === 'discord') {
                    setIsDiscordAuth(true)
                }
            })
        }
    }, [user])

    useEffect(() => {
        axios
            .get('https://metapass-discord-inte-production.up.railway.app/')
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [user])

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                <ModalHeader textAlign="center" mt="10">
                    Update Discord Integration
                </ModalHeader>
                <ModalCloseButton _focus={{}} />

                <ModalBody
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="3"
                >
                    {isDiscordAuth ? (
                        <Flex justify="center">
                            hello, {''}
                            {user?.identities?.map((id) => {
                                if (id.provider === 'discord') {
                                    return id.identity_data.name
                                }
                            })}
                        </Flex>
                    ) : (
                        <Button
                            onClick={async () => {
                                await supabase.auth.signIn(
                                    {
                                        provider: 'discord',
                                    },
                                    {
                                        redirectTo:
                                            'http://localhost:3000/create',
                                    }
                                )
                            }}
                        >
                            Connect Discord Account
                        </Button>
                    )}

                    <Select placeholder="Select your Server"></Select>
                    <Select placeholder="Select desired Role"></Select>

                    <Button>Update Integration</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordModal
