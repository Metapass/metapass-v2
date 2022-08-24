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
    Spinner,
} from '@chakra-ui/react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'
import { getAllSvs } from '../../utils/helpers/api/getAllSvs'
import { isCommonSv } from '../../utils/helpers/api/isCommonSv'

const DiscordModal = ({ isOpen, onOpen, onClose }: ModalProps) => {
    const user = supabase.auth.user()
    const session = supabase.auth.session()

    const [isDiscordAuth, setIsDiscordAuth] = useState(false)
    const [commonSvs, setCommonSvs] = useState<any[]>([])

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
        const fetchCommonSvs = async () => {
            let arr: any[] = []
            if (user) {
                const allSvs = await getAllSvs(session?.access_token!)

                allSvs?.data.map(async (s: any) => {
                    const res = await isCommonSv(
                        s.id!,
                        user?.user_metadata.sub,
                        session?.access_token!
                    )

                    if (res.isAdmin) {
                        arr.push(s)
                    }
                })
            }
            setCommonSvs(arr)
        }

        fetchCommonSvs()
    }, [session, user])

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
                    gap="6"
                >
                    {isDiscordAuth ? (
                        <Flex
                            justify="center"
                            color="rgba(0, 0, 0, 0.8)"
                            fontWeight="500"
                        >
                            Hello, {''}
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
                            h="10"
                            px="10"
                            rounded="full"
                            fontWeight="500"
                            color="rgba(0, 0, 0, 0.8)"
                            bg="white"
                            border="1px solid #E7B0FF"
                            gap="2"
                        >
                            <Image
                                src="/assets/icons/discord.svg"
                                alt="discord"
                                height="6"
                            />
                            Connect Discord Account
                        </Button>
                    )}

                    {commonSvs.length > 0 ? (
                        <>
                            <Select placeholder="Select your Server">
                                {commonSvs.map((s: any) => (
                                    <option value={s.id} key={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </Select>
                            <Select placeholder="Select desired Role"></Select>
                        </>
                    ) : (
                        <Spinner />
                    )}

                    <Button>Update Integration</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordModal
