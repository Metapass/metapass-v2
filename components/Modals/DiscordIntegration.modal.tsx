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
    Box,
} from '@chakra-ui/react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'
import { getAllSvs } from '../../utils/helpers/api/getAllSvs'
import { isCommonSv } from '../../utils/helpers/api/isCommonSv'
import RoleChooser from '../Misc/RoleChooser.elem'

const DiscordModal = ({ isOpen, onOpen, onClose }: ModalProps) => {
    const user = supabase.auth.user()
    const session = supabase.auth.session()

    const [isDiscordAuth, setIsDiscordAuth] = useState(false)
    const [commonSvs, setCommonSvs] = useState<any[]>([
        {
            id: '1009738223863480370',
            name: 'metapass-discord-inte',
        },
        {
            id: '1011584449865072801',
            name: 'metapass-test-2',
        },
    ])
    const [sv, setSv] = useState<string>('')

    useEffect(() => {
        if (user) {
            user.app_metadata.providers.map((p: string) => {
                if (p === 'discord') {
                    setIsDiscordAuth(true)
                }
            })
        }
    }, [user])

    // useEffect(() => {
    //     const fetchCommonSvs = async () => {
    //         let arr: any[] = []
    //         if (user) {
    //             const allSvs = await getAllSvs(session?.access_token!)

    //             allSvs?.data.map(async (s: any) => {
    //                 const res = await isCommonSv(
    //                     s.id!,
    //                     user?.user_metadata.sub,
    //                     session?.access_token!
    //                 )

    //                 if (res.isAdmin) {
    //                     arr.push(s)
    //                 }
    //             })
    //         }
    //         setCommonSvs(arr)
    //     }

    //     fetchCommonSvs()
    // }, [session, user])

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
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
                        <Box bg="brand.gradient" rounded="full" p="1px">
                            <Flex
                                justify="center"
                                color="rgba(0, 0, 0, 0.8)"
                                fontWeight="500"
                                h="full"
                                w="full"
                                py="2"
                                px="8"
                                bg="white"
                                rounded="full"
                            >
                                Hello, {''}
                                {user?.identities?.map((id) => {
                                    if (id.provider === 'discord') {
                                        return id.identity_data.name
                                    }
                                })}
                            </Flex>
                        </Box>
                    ) : (
                        <Button
                            onClick={async () => {
                                await supabase.auth.signIn(
                                    {
                                        provider: 'discord',
                                    },
                                    {
                                        redirectTo: window?.location.href,
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
                    <Flex justifyContent="center">
                        {commonSvs.length > 0 ? (
                            <Select
                                placeholder="Select your Server"
                                w="sm"
                                onChange={(e) => {
                                    setSv(e.target.value)
                                }}
                            >
                                {commonSvs.map((s: any) => (
                                    <option value={s.id} key={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <Spinner />
                        )}
                    </Flex>

                    <RoleChooser guild={sv} />

                    <Button
                        bg="brand.gradient"
                        color="white"
                        rounded="full"
                        px="6"
                        _hover={{}}
                        fontWeight="500"
                        mb="4"
                    >
                        Update Integration
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordModal
