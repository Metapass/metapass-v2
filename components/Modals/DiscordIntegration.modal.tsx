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
    Text,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'
import { getAllSvs } from '../../utils/helpers/api/getAllSvs'
import { isCommonSv } from '../../utils/helpers/api/isCommonSv'
import RoleChooser from '../Misc/RoleChooser.elem'
import { useRecoilState } from 'recoil'
import { discordEventDataAtom } from '../../lib/recoil/atoms'

const DiscordModal = ({ isOpen, onOpen, onClose }: ModalProps) => {
    const user = supabase.auth.user()
    const session = supabase.auth.session()
    const [discordEventData, setDiscordEventData] =
        useRecoilState(discordEventDataAtom)

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
            if (user) {
                const allSvs = await getAllSvs(session?.access_token!)
                let arr: any[] = []
                // console.log(allSvs, user, 'check')
                allSvs?.data.map(async (s: any) => {
                    const res = await isCommonSv(
                        s.id!,
                        user?.user_metadata.sub,
                        session?.access_token!
                    )
                    // console.log(res, 'res')
                    if (res && res.isAdmin) {
                        setCommonSvs((prev) => [...prev, s])
                    }
                })
            }
        }

        try {
            fetchCommonSvs()
        } catch (error) {
            console.log('error', error)
        }
    }, [session, user])
    // console.log(commonSvs, 'commonSvs')
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
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
                            alignItems="center"
                        >
                            Hello,&nbsp;
                            {user?.identities?.map((id) => {
                                if (id.provider === 'discord') {
                                    return (
                                        <Text as="span" color="pink.500">
                                            {id.identity_data.name}
                                        </Text>
                                    )
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
                        <Select
                            placeholder="Select your Server"
                            w="sm"
                            onChange={(e) => {
                                setDiscordEventData({
                                    ...discordEventData,
                                    guild: e.target.value,
                                    roles: [],
                                })
                            }}
                        >
                            {commonSvs &&
                                commonSvs.length > 0 &&
                                commonSvs.map((s: any) => (
                                    <option value={s.id} key={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                        </Select>
                    </Flex>

                    <RoleChooser guild={discordEventData.guild} />

                    <Button
                        bg="brand.gradient"
                        color="white"
                        rounded="full"
                        px="6"
                        _hover={{}}
                        fontWeight="500"
                        mb="4"
                        onClick={onClose}
                    >
                        Update Integration
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordModal
