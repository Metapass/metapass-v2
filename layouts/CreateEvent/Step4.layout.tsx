import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Switch,
    Text,
    useDisclosure,
} from '@chakra-ui/react'

// import { MdCalendarToday as CalendarToday } from "react-icons/md";
import { HiOutlineChevronRight as ChevronRight } from 'react-icons/hi'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import EventCard from '../../components/Card/EventCard.component'
import { events } from '../../utils/testData'
import DateModal from './DateModal.layout'
import { walletContext } from '../../utils/walletContext'
// import gravatarUrl from 'gravatar-url'
import { encryptLink } from '../../utils/linkResolvers'
import BoringAva from '../../utils/BoringAva'
import { getAllEnsLinked } from '../../utils/resolveEns'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function Step4({
    event,
    onSubmit,
}: {
    event: any
    onSubmit: Function
}) {
    const [wallet, setWallet] = useContext(walletContext)
    const [_link, setLink] = useState<string>('')
    const [ensName, setEnsName] = useState<string>('')

    useEffect(() => {
        getAllEnsLinked(event.owner)
            .then((data) => {
                if (data?.data?.domains && data && data?.data) {
                    console.log(
                        data?.data?.domains?.length,
                        data?.data?.domains?.length > 0 &&
                            data?.data?.domains[data?.data?.domains.length - 1].name
                    )
                    const ens_name =
                        data?.data?.domains?.length > 0 &&
                        data?.data?.domains[data?.data?.domains.length - 1].name
                    setEnsName(ens_name)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        // console.log(wallet)
    }, [event.owner])

    return (
        <>
            {wallet.address && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit(encryptLink(_link))
                    }}
                >
                    <Box color="brand.black">
                        <Text
                            align="center"
                            color="brand.black400"
                            fontSize="4xl"
                            fontWeight="semibold"
                        >
                            We are almost done
                        </Text>

                        <Flex
                            justify="space-between"
                            experimental_spaceX={{ base: '12', xl: '16' }}
                            mt="6"
                            px="10"
                            maxW="1200px"
                            mx="auto"
                        >
                            <Box fontFamily="body" w="full">
                                <FormControl
                                    maxW="400px"
                                    isRequired
                                    borderBottom="2px"
                                    borderBottomColor="gray.200"
                                    _focusWithin={{
                                        borderBottomColor: 'gray.300',
                                    }}
                                >
                                    <FormLabel
                                        fontSize={{ base: 'md', xl: 'lg' }}
                                        color="blackAlpha.700"
                                        my="0"
                                    >
                                        Who’s the hosting this event?
                                    </FormLabel>

                                    <Flex mt="2" direction="column" mb="1">
                                        <Flex
                                            experimental_spaceX="2"
                                            align="center"
                                            rounded="xl"
                                            _hover={{ bg: 'blackAlpha.50' }}
                                            mx="-4"
                                            px="4"
                                            py="2"
                                            cursor="pointer"
                                            transitionDuration="100ms"
                                        >
                                            <BoringAva
                                                address={wallet.address}
                                            />
                                            <Box>
                                                <Text fontSize="14px">
                                                    {wallet.address.substring(
                                                        0,
                                                        6
                                                    ) +
                                                        '...' +
                                                        wallet.address.substring(
                                                            wallet.address
                                                                .length - 6
                                                        )}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </FormControl>

                                <FormControl
                                    maxW="500px"
                                    mt="8"
                                    isRequired
                                    borderBottom="2px"
                                    borderBottomColor="gray.200"
                                    _focusWithin={{
                                        borderBottomColor: 'gray.300',
                                    }}
                                >
                                    <FormLabel
                                        fontSize={{ base: 'md', xl: 'lg' }}
                                        color="blackAlpha.700"
                                        my="0"
                                    >
                                        Link for attendees.
                                    </FormLabel>

                                    <Input
                                        onChange={(e) => {
                                            setLink(e.target.value)
                                        }}
                                        fontSize="sm"
                                        value={_link}
                                        required
                                        px="0"
                                        _placeholder={{ color: 'gray.300' }}
                                        placeholder="Link for attendees to join"
                                        bg="transparent"
                                        border="none"
                                        rounded="none"
                                        _hover={{}}
                                        _focus={{}}
                                        _active={{}}
                                    />
                                </FormControl>
                            </Box>
                            <Box h="auto" w="2px" my="10" bg="gray.100" />
                            <Box>
                                <Flex justify="center" mb="4">
                                    <Text
                                        style={{
                                            background:
                                                '-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                        textAlign="center"
                                        fontWeight="semibold"
                                        fontSize="2xl"
                                    >
                                        Live Preview
                                    </Text>
                                    <Image
                                        w={{ base: '4', lg: '4' }}
                                        ml="1"
                                        mt="-6"
                                        src="/assets/elements/sparkle_gradient.svg"
                                        alt="element"
                                    />
                                </Flex>
                                <Box minW="220px">
                                    <Box
                                        mt="3"
                                        rounded="xl"
                                        px="4"
                                        border="1px"
                                        borderColor="blackAlpha.100"
                                        boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                                        py="2"
                                    >
                                        <Text
                                            color="blackAlpha.500"
                                            fontSize="xs"
                                        >
                                            Hosted By
                                        </Text>
                                        <Flex mt="2" direction="column" mb="1">
                                            <Flex
                                                experimental_spaceX="2"
                                                align="center"
                                                _hover={{ bg: 'blackAlpha.50' }}
                                                mx="-4"
                                                px="4"
                                                py="2"
                                                cursor="pointer"
                                                transitionDuration="100ms"
                                            >
                                                <BoringAva
                                                    address={wallet.address}
                                                />
                                                <Box>
                                                    <Text fontSize="14px">
                                                        {ensName ||
                                                            wallet.address.substring(
                                                                0,
                                                                6
                                                            ) +
                                                                '...' +
                                                                wallet.address.substring(
                                                                    wallet
                                                                        .address
                                                                        .length -
                                                                        6
                                                                )}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Box>
                            </Box>
                        </Flex>
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            alignContent="center"
                            mt="10"
                            mb="20"
                        >
                            <Button
                                size="lg"
                                rounded="full"
                                type="submit"
                                bg="brand.gradient"
                                color="white"
                                rightIcon={
                                    <Flex
                                        justify="center"
                                        alignItems="center"
                                        transitionDuration="200ms"
                                        _groupHover={{
                                            transform: 'translateX(4px)',
                                        }}
                                    >
                                        <ChevronRight />
                                    </Flex>
                                }
                                _hover={{}}
                                _focus={{}}
                                _active={{}}
                                py="7"
                                role="group"
                                fontWeight="medium"
                                px="8"
                            >
                                Review Details
                            </Button>
                        </Flex>
                    </Box>
                </form>
            )}
        </>
    )
}
