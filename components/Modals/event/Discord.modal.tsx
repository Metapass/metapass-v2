import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Flex,
    Image,
    Text,
    Button,
    Spinner,
    Box,
    Center,
} from '@chakra-ui/react'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/config/supabaseConfig'
import { IDiscordData } from '../../../types/discordEveent.types'
import { motion } from 'framer-motion'
import { validateRoles } from '../../../utils/helpers/api/validateRoles'
import { fetchServer } from '../../../utils/helpers/api/fetchServer'

const DiscordRoleModal = ({
    isOpen,
    onOpen,
    onClose,
    event,
    handleClick,
    isLoading,
}: any) => {
    const [isDiscordAuth, setIsDiscordAuth] = useState<boolean>(false)
    const [discordData, setDiscordData] = useState<IDiscordData>()
    const [isAllowed, setIsAllowed] = useState<boolean>(false)
    console.log(isAllowed)
    const user = supabase.auth.user()
    const session = supabase.auth.session()

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
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('discord_events')
                .select('*')
                .eq('event', utils.getAddress(event.childAddress))

            if (data?.length! > 0) {
                setDiscordData({
                    guild: data?.[0].guild,
                    roles: data?.[0].roles,
                })
            }
        }

        fetchData()
    }, [event])

    useEffect(() => {
        const fetchData = async () => {
            const id = user?.user_metadata.sub
            const res = await validateRoles(
                discordData?.roles!,
                id,
                discordData?.guild!,
                session?.access_token!
            )

            setIsAllowed(res)
        }

        fetchData()
    }, [discordData, session, user])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchServer(
                discordData?.guild!,
                session?.access_token!
            )

            console.log(res)
            setDiscordData({
                ...discordData!,
                name: res?.name!,
            })
        }

        fetchData()
    })

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
                <ModalHeader>
                    <ModalCloseButton />
                </ModalHeader>

                <ModalBody
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="6"
                    py="4"
                >
                    {isDiscordAuth ? (
                        <Flex
                            justify="center"
                            color="rgba(0, 0, 0, 0.8)"
                            fontWeight="500"
                            alignItems="center"
                            fontSize="lg"
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

                    {isAllowed ? (
                        <Flex
                            direction="column"
                            gap="4"
                            justifyContent="center"
                            textAlign="center"
                        >
                            <Text color="rgba(0, 0, 0, 0.63)" fontWeight="500">
                                This event is gated for&nbsp;
                                <Text as="span" color="pink.500">
                                    {discordData?.name}
                                </Text>{' '}
                                guild members with specified roles
                            </Text>

                            <Text color="rgba(0, 0, 0, 0.63)" fontWeight="500">
                                As a guild member of the server, you do have the
                                required roles. So you may proceed with minting
                                the ticket.
                            </Text>
                            <Center>
                                <Button
                                    display={{ base: 'none', md: 'flex' }}
                                    w="40"
                                    rounded="full"
                                    bg="brand.gradient"
                                    fontWeight="medium"
                                    role="group"
                                    loadingText="Minting"
                                    isLoading={isLoading}
                                    boxShadow="0px 4px 32px rgba(0, 0, 0, 0.12)"
                                    color="white"
                                    _disabled={{
                                        opacity: '0.8',
                                        cursor: 'not-allowed',
                                    }}
                                    _hover={{}}
                                    onClick={handleClick}
                                    _focus={{}}
                                    _active={{}}
                                    mr="3"
                                    leftIcon={
                                        <Box
                                            _groupHover={{
                                                transform: 'scale(1.1)',
                                            }}
                                            transitionDuration="100ms"
                                        >
                                            <Image
                                                src="/assets/elements/event_ticket.svg"
                                                w={{ base: '6', md: '5' }}
                                                alt="ticket"
                                            />
                                        </Box>
                                    }
                                >
                                    Buy Ticket
                                </Button>
                            </Center>
                        </Flex>
                    ) : (
                        <Flex
                            direction="column"
                            gap="4"
                            justifyContent="center"
                            textAlign="center"
                        >
                            <Text color="rgba(0, 0, 0, 0.63)" fontWeight="500">
                                This event is gated for&nbsp;
                                <Text as="span" color="pink.500">
                                    {discordData?.name}
                                </Text>{' '}
                                guild members with specified roles
                            </Text>

                            <Text color="rgba(0, 0, 0, 0.63)" fontWeight="500">
                                You do not have the required roles to proceed.
                            </Text>
                        </Flex>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordRoleModal
