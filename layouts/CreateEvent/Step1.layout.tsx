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
    InputLeftElement,
    InputRightElement,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Switch,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { MdCalendarToday as CalendarToday } from 'react-icons/md'
import { HiOutlineChevronRight as ChevronRight } from 'react-icons/hi'
import { useContext, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import EventCard from '../../components/Card/EventCard.component'
import DateModal from './DateModal.layout'
import { walletContext, WalletType } from '../../utils/walletContext'
import { discordBased, inviteOnlyAtom } from '../../lib/recoil/atoms'
import DiscordModal from '../../components/Modals/DiscordIntegration.modal'
export type PaymentToken = 'USDC' | 'USDT'
export const CustomTokens = {
    SOL: {
        USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    },
    POLYGON: {
        USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    },
}
export default function Step1({
    onSubmit,
    isSolHost,
}: {
    onSubmit: Function
    isSolHost: Boolean
}) {
    const [isPaid, setIsPaid] = useState(true)
    const [isInviteOnly, setIsInviteOnly] = useRecoilState(inviteOnlyAtom)
    const [isDiscordBased, setIsDiscordBased] = useRecoilState(discordBased)
    const [formDetails, setFormDetails] = useState({
        title: '',
        type: '',
        category: {
            category: [''],
            event_type: '',
            inviteOnly: false,
            isDiscordBased: false,
        },
        fee: 0,
        date: '',
        seats: 0,
        tickets_sold: 0,
        profileImage: '',
        displayName: '',
        customSPLToken: '',
        chain: '',
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onClose: onClose1,
    } = useDisclosure()
    const [submitting, setSubmitting] = useState(false)
    const [wallet] = useContext<WalletType[]>(walletContext)
    const [paymentToken, setPaymentToken] = useState<PaymentToken>('USDC')

    useEffect(() => {
        if (wallet.chain === 'SOL') {
            formDetails.customSPLToken = CustomTokens.SOL[paymentToken]
        } else if (wallet.chain === 'POLYGON') {
            formDetails.customSPLToken = CustomTokens.POLYGON[paymentToken]
        }
    }, [paymentToken, formDetails, wallet.chain])
    // In the future we should prompt either solana or eth wallet to connect base on the chain user selects in form
    if (wallet.address) {
        return (
            <>
                {isOpen1 && (
                    <DiscordModal
                        isOpen={isOpen1}
                        onOpen={onOpen1}
                        onClose={onClose1}
                    />
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (submitting) {
                            // console.log('submitting')
                            onSubmit(formDetails)
                        }
                    }}
                >
                    <Box color="brand.black">
                        {isOpen && (
                            <DateModal
                                isOpen={isOpen}
                                onClose={onClose}
                                onSubmit={(date: any) => {
                                    setFormDetails({
                                        ...formDetails,
                                        date,
                                    })

                                    console.log(date)
                                }}
                            />
                        )}
                        <Text
                            align="center"
                            color="brand.black400"
                            fontSize="4xl"
                            fontWeight="semibold"
                        >
                            Tell us about your event
                        </Text>
                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="body"
                            mt="2"
                            fontWeight="normal"
                        >
                            <FormLabel
                                fontFamily="body"
                                color="blackAlpha.700"
                                fontWeight="normal"
                                mb="0"
                                htmlFor="price"
                            >
                                Is it a paid event?
                            </FormLabel>

                            <Switch
                                onChange={(e) => {
                                    setIsPaid(e.target.checked)
                                    setFormDetails({
                                        ...formDetails,
                                        fee: 0,
                                    })
                                }}
                                isChecked={isPaid}
                                id="price"
                                colorScheme="linkedin"
                            />
                        </FormControl>
                        {/* <Text
                            align="center"
                            color="brand.black400"
                            fontSize="4xl"
                            fontWeight="semibold"
                        >
                            Tell us about your event
                        </Text>
                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="body"
                            mt="2"
                            fontWeight="normal"
                        >
                            <FormLabel
                                fontFamily="body"
                                color="blackAlpha.700"
                                fontWeight="normal"
                                mb="0"
                                htmlFor="price"
                            >
                                Is it a paid event?
                            </FormLabel>

                            <Switch
                                onChange={(e) => {
                                    setIsPaid(e.target.checked)
                                    setFormDetails({
                                        ...formDetails,
                                        fee: 0,
                                    })
                                }}
                                isChecked={isPaid}
                                id="price"
                                colorScheme="linkedin"
                            />
                        </FormControl> */}

                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="body"
                            mt="2"
                            fontWeight="normal"
                        >
                            <FormLabel
                                fontFamily="body"
                                color="blackAlpha.700"
                                fontWeight="normal"
                                mb="0"
                                htmlFor="price"
                            >
                                Invite only Event?
                            </FormLabel>

                            <Switch
                                onChange={(e) => {
                                    setIsInviteOnly(e.target.checked)
                                    setIsDiscordBased(false)
                                    setFormDetails({
                                        ...formDetails,
                                        category: {
                                            ...formDetails.category,
                                            inviteOnly: e.target.checked,
                                        },
                                    })
                                }}
                                isChecked={isInviteOnly}
                                id="price"
                                colorScheme="linkedin"
                            />
                        </FormControl>

                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="body"
                            mt="2"
                            fontWeight="normal"
                        >
                            <FormLabel
                                fontFamily="body"
                                color="blackAlpha.700"
                                fontWeight="normal"
                                mb="0"
                                htmlFor="price"
                            >
                                Is Discord Based
                            </FormLabel>

                            <Switch
                                onChange={(e) => {
                                    setIsDiscordBased(e.target.checked)
                                    setIsInviteOnly(false)
                                    setFormDetails({
                                        ...formDetails,
                                        category: {
                                            ...formDetails.category,
                                            isDiscordBased: e.target.checked,
                                        },
                                    })
                                }}
                                isChecked={isDiscordBased}
                                id="price"
                                colorScheme="linkedin"
                            />
                        </FormControl>
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
                                    borderBottom="2px"
                                    borderBottomColor="gray.200"
                                    _focusWithin={{
                                        borderBottomColor: 'gray.300',
                                    }}
                                >
                                    <FormLabel
                                        fontSize={{ lg: 'md', xl: 'lg' }}
                                        color="blackAlpha.700"
                                        my="0"
                                    >
                                        Event Name
                                    </FormLabel>

                                    <Input
                                        onChange={(e) => {
                                            setFormDetails({
                                                ...formDetails,
                                                title: e.target.value,
                                            })
                                        }}
                                        fontSize="sm"
                                        value={formDetails.title}
                                        required
                                        px="0"
                                        _placeholder={{ color: 'gray.300' }}
                                        placeholder="Name of your event"
                                        bg="transparent"
                                        border="none"
                                        rounded="none"
                                        _hover={{}}
                                        _focus={{}}
                                        _active={{}}
                                    />
                                </FormControl>
                                <Flex experimental_spaceX="8" mt="6">
                                    <FormControl
                                        borderBottom="2px"
                                        borderBottomColor="gray.200"
                                        _focusWithin={{
                                            borderBottomColor: 'gray.300',
                                        }}
                                    >
                                        <FormLabel
                                            fontSize={{ lg: 'md', xl: 'lg' }}
                                            color="blackAlpha.700"
                                            my="0"
                                        >
                                            Event Type
                                        </FormLabel>
                                        <Menu>
                                            <MenuButton type="button" w="full">
                                                <InputGroup>
                                                    <Input
                                                        fontSize="sm"
                                                        required
                                                        px="0"
                                                        value={
                                                            formDetails.category
                                                                .event_type
                                                        }
                                                        _placeholder={{
                                                            color: 'gray.300',
                                                        }}
                                                        placeholder="Is this event online/in-person?"
                                                        bg="transparent"
                                                        border="none"
                                                        rounded="none"
                                                        _hover={{}}
                                                        _focus={{}}
                                                        _active={{}}
                                                        isReadOnly
                                                    />
                                                    <InputRightElement color="gray.400">
                                                        <FaChevronDown />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </MenuButton>
                                            <MenuList
                                                rounded="lg"
                                                shadow="sm"
                                                fontSize="sm"
                                                mt="1"
                                                zIndex={9}
                                            >
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setFormDetails({
                                                            ...formDetails,
                                                            category: {
                                                                ...formDetails.category,
                                                                event_type:
                                                                    'Online',
                                                            },
                                                        })
                                                    }}
                                                >
                                                    Online
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setFormDetails({
                                                            ...formDetails,
                                                            category: {
                                                                ...formDetails.category,
                                                                event_type:
                                                                    'In-Person',
                                                            },
                                                        })
                                                    }}
                                                >
                                                    In-person
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>
                                    <FormControl
                                        borderBottom="2px"
                                        borderBottomColor="gray.200"
                                        _focusWithin={{
                                            borderBottomColor: 'gray.300',
                                        }}
                                    >
                                        <FormLabel
                                            fontSize={{ lg: 'md', xl: 'lg' }}
                                            color="blackAlpha.700"
                                            my="0"
                                        >
                                            Event Category
                                        </FormLabel>
                                        <Menu>
                                            <MenuButton type="button" w="full">
                                                <InputGroup>
                                                    <Input
                                                        fontSize="sm"
                                                        value={
                                                            formDetails.category
                                                                .category[0]
                                                        }
                                                        required
                                                        px="0"
                                                        _placeholder={{
                                                            color: 'gray.300',
                                                        }}
                                                        placeholder="Category of your event"
                                                        bg="transparent"
                                                        border="none"
                                                        rounded="none"
                                                        _hover={{}}
                                                        _focus={{}}
                                                        _active={{}}
                                                        isReadOnly
                                                    />
                                                    <InputRightElement color="gray.400">
                                                        <FaChevronDown />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </MenuButton>
                                            <MenuList
                                                rounded="lg"
                                                shadow="sm"
                                                fontSize="sm"
                                                mt="1"
                                                zIndex={9}
                                            >
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setFormDetails({
                                                            ...formDetails,
                                                            category: {
                                                                ...formDetails.category,
                                                                category: [
                                                                    'Meetup',
                                                                ],
                                                            },
                                                        })
                                                    }}
                                                >
                                                    Meetup
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={(e) => {
                                                        setFormDetails({
                                                            ...formDetails,
                                                            category: {
                                                                ...formDetails.category,
                                                                category: [
                                                                    'Party',
                                                                ],
                                                            },
                                                        })
                                                    }}
                                                >
                                                    Party
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>
                                </Flex>
                                <Flex experimental_spaceX="8" mt="6">
                                    <FormControl
                                        opacity={isPaid ? 1 : 0.8}
                                        _disabled={{}}
                                        isDisabled={!isPaid}
                                        borderBottom="2px"
                                        borderBottomColor="gray.200"
                                        _focusWithin={{
                                            borderBottomColor: 'gray.300',
                                        }}
                                    >
                                        <FormLabel
                                            fontSize={{ lg: 'md', xl: 'lg' }}
                                            color="blackAlpha.700"
                                            my="0"
                                        >
                                            Ticket Amount
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                isRequired={isPaid}
                                                onChange={(e) => {
                                                    setFormDetails({
                                                        ...formDetails,
                                                        fee: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }}
                                                type="number"
                                                step="any"
                                                fontSize="sm"
                                                px="0"
                                                _placeholder={{
                                                    color: 'gray.300',
                                                }}
                                                placeholder="Price of one ticket"
                                                bg="transparent"
                                                border="none"
                                                rounded="none"
                                                _hover={{}}
                                                _focus={{}}
                                                _active={{}}
                                                value={
                                                    formDetails.fee === 0
                                                        ? ''
                                                        : formDetails.fee
                                                }
                                            />
                                            <InputRightElement>
                                                <Flex
                                                    borderLeft="2px"
                                                    borderColor="gray.200"
                                                    experimental_spaceX="2"
                                                    align="center"
                                                    mr="20"
                                                    bg="white"
                                                    pl="2"
                                                >
                                                    {wallet.chain ===
                                                    'POLYGON' ? (
                                                        <>
                                                            <Image
                                                                src={
                                                                    '/assets/matic_circle.svg'
                                                                }
                                                                alt={'Matic'}
                                                                w="4"
                                                                h="4"
                                                            />
                                                            <Text
                                                                color="blackAlpha.700"
                                                                fontSize="sm"
                                                                letterSpacing={
                                                                    1
                                                                }
                                                                fontWeight="medium"
                                                                fontFamily="heading"
                                                            >
                                                                {'MATIC'}
                                                            </Text>
                                                        </>
                                                    ) : (
                                                        <Menu>
                                                            <MenuButton
                                                                type="button"
                                                                w="100px"
                                                            >
                                                                <InputGroup>
                                                                    <Input
                                                                        fontSize="sm"
                                                                        isRequired
                                                                        px="0"
                                                                        _placeholder={{
                                                                            color: 'gray.300',
                                                                        }}
                                                                        value={
                                                                            paymentToken
                                                                        }
                                                                        placeholder="Token"
                                                                        bg="transparent"
                                                                        border="none"
                                                                        rounded="none"
                                                                        _hover={{}}
                                                                        _focus={{}}
                                                                        _active={{}}
                                                                        isReadOnly
                                                                    />

                                                                    <Image
                                                                        mt="3"
                                                                        src={`/assets/tokens/${paymentToken}.svg`}
                                                                        alt={
                                                                            paymentToken
                                                                        }
                                                                        w="4"
                                                                        h="4"
                                                                    />

                                                                    <InputLeftElement color="gray.400">
                                                                        <FaChevronDown />
                                                                    </InputLeftElement>
                                                                </InputGroup>
                                                            </MenuButton>

                                                            <MenuList>
                                                                {[
                                                                    'USDC',
                                                                    'USDT',
                                                                ].map(
                                                                    (
                                                                        token,
                                                                        key
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                key
                                                                            }
                                                                            onClick={() =>
                                                                                setPaymentToken(
                                                                                    token as PaymentToken
                                                                                )
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={`/assets/tokens/${token}.svg`}
                                                                                alt={
                                                                                    token
                                                                                }
                                                                                w="4"
                                                                                h="4"
                                                                                mr="1"
                                                                            />
                                                                            <Text
                                                                                color="blackAlpha.700"
                                                                                fontSize="sm"
                                                                                letterSpacing={
                                                                                    1
                                                                                }
                                                                                fontWeight="medium"
                                                                                fontFamily="heading"
                                                                            >
                                                                                {
                                                                                    token
                                                                                }
                                                                            </Text>
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </MenuList>
                                                        </Menu>
                                                    )}
                                                </Flex>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl
                                        onClick={onOpen}
                                        borderBottom="2px"
                                        borderBottomColor="gray.200"
                                        _focusWithin={{
                                            borderBottomColor: 'gray.300',
                                        }}
                                    >
                                        <FormLabel
                                            fontSize={{ lg: 'md', xl: 'lg' }}
                                            color="blackAlpha.700"
                                            my="0"
                                        >
                                            Date of Event
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                _placeholder={{
                                                    color: 'gray.300',
                                                }}
                                                fontSize="sm"
                                                isRequired
                                                cursor="pointer"
                                                value={
                                                    formDetails.date.split(
                                                        'T'
                                                    )[0]
                                                }
                                                px="0"
                                                placeholder="When will the event take place?"
                                                bg="transparent"
                                                border="none"
                                                rounded="none"
                                                _hover={{}}
                                                _focus={{}}
                                                _active={{}}
                                                isReadOnly
                                            />
                                            <InputRightElement color="gray.400">
                                                <CalendarToday />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                </Flex>
                                <Flex experimental_spaceX="8" mt="6">
                                    <FormControl
                                        mt="6"
                                        w="50%"
                                        borderBottom="2px"
                                        borderBottomColor="gray.200"
                                        _focusWithin={{
                                            borderBottomColor: 'gray.300',
                                        }}
                                    >
                                        <FormLabel
                                            fontSize={{ lg: 'md', xl: 'lg' }}
                                            color="blackAlpha.700"
                                            my="0"
                                        >
                                            Total Tickets
                                        </FormLabel>
                                        <InputGroup>
                                            <Input
                                                onChange={(e) => {
                                                    setFormDetails({
                                                        ...formDetails,
                                                        seats: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }}
                                                _placeholder={{
                                                    color: 'gray.300',
                                                }}
                                                fontSize="sm"
                                                required
                                                min="1"
                                                type="number"
                                                step="1"
                                                px="0"
                                                placeholder="Total seats for the event"
                                                bg="transparent"
                                                border="none"
                                                rounded="none"
                                                _hover={{}}
                                                _focus={{}}
                                                _active={{}}
                                                value={
                                                    formDetails.seats === 0
                                                        ? ''
                                                        : formDetails.seats
                                                }
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    {wallet.chain == 'SOL' && !isSolHost && (
                                        <FormControl
                                            mt="6"
                                            w="50%"
                                            borderBottom="2px"
                                            borderBottomColor="gray.200"
                                            _focusWithin={{
                                                borderBottomColor: 'gray.300',
                                            }}
                                        >
                                            <FormLabel
                                                fontSize={{
                                                    lg: 'md',
                                                    xl: 'lg',
                                                }}
                                                color="blackAlpha.700"
                                                my="0"
                                            >
                                                Host Name
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    onChange={(e) => {
                                                        setFormDetails({
                                                            ...formDetails,
                                                            displayName:
                                                                e.target.value,
                                                        })
                                                    }}
                                                    _placeholder={{
                                                        color: 'gray.300',
                                                    }}
                                                    fontSize="sm"
                                                    required
                                                    min="1"
                                                    type="text"
                                                    step="1"
                                                    px="0"
                                                    placeholder="Add your name"
                                                    bg="transparent"
                                                    border="none"
                                                    rounded="none"
                                                    _hover={{}}
                                                    _focus={{}}
                                                    _active={{}}
                                                    value={
                                                        formDetails.displayName
                                                    }
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    )}
                                </Flex>
                                <Flex experimental_spaceX="8" mt="6">
                                    {wallet.chain == 'SOL' && !isSolHost && (
                                        <>
                                            <FormControl
                                                mt="6"
                                                w="50%"
                                                borderBottom="2px"
                                                borderBottomColor="gray.200"
                                                _focusWithin={{
                                                    borderBottomColor:
                                                        'gray.300',
                                                }}
                                            >
                                                <FormLabel
                                                    fontSize={{
                                                        lg: 'md',
                                                        xl: 'lg',
                                                    }}
                                                    color="blackAlpha.700"
                                                    my="0"
                                                >
                                                    Host Avatar
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        onChange={(e) => {
                                                            setFormDetails({
                                                                ...formDetails,
                                                                profileImage:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }}
                                                        _placeholder={{
                                                            color: 'gray.300',
                                                        }}
                                                        fontSize="sm"
                                                        required
                                                        min="1"
                                                        type="url"
                                                        step="1"
                                                        px="0"
                                                        placeholder="host avatar url"
                                                        bg="transparent"
                                                        border="none"
                                                        rounded="none"
                                                        _hover={{}}
                                                        _focus={{}}
                                                        _active={{}}
                                                        value={
                                                            formDetails.profileImage
                                                        }
                                                    />
                                                    <InputRightElement>
                                                        <Avatar
                                                            src={
                                                                formDetails.profileImage
                                                            }
                                                            maxW="6"
                                                            maxH="6"
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </>
                                    )}
                                </Flex>
                                <Flex experimental_spaceX="8" mt="6">
                                    <Button
                                        bg="brand.gradient"
                                        rounded="full"
                                        color="white"
                                        fontWeight="500"
                                        px="6"
                                        _hover={{}}
                                        _active={{}}
                                        _focus={{}}
                                        isDisabled={!isDiscordBased}
                                        onClick={onOpen1}
                                    >
                                        Update Discord Integration info
                                    </Button>
                                </Flex>
                            </Box>
                            <Box h="auto" w="2px" my="20" bg="gray.100" />
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
                                <Box minW={{ base: '320px', xl: '360px' }}>
                                    <EventCard
                                        previewOnly
                                        event={{
                                            id: '',
                                            childAddress: '',
                                            title:
                                                formDetails.title || 'Untitled',
                                            description: {
                                                short_desc:
                                                    'Event description goes here',
                                            },
                                            image: {
                                                image: '/assets/gradient.png',
                                                gallery: [],
                                            },
                                            date: formDetails.date
                                                ? formDetails.date
                                                : '1/1/2000',
                                            eventHost: wallet.address || '',
                                            owner: wallet.address || '',
                                            type:
                                                formDetails.category
                                                    .event_type || 'type',
                                            category: {
                                                category: [
                                                    formDetails.category
                                                        .category[0] ||
                                                        'category',
                                                ],
                                                // @ts-ignore
                                                event_type:
                                                    formDetails.category
                                                        .event_type || 'type',
                                            },
                                            buyers: [],

                                            fee: Number(formDetails.fee),
                                            seats: formDetails.seats || 20,
                                            tickets_available:
                                                formDetails.seats || 20,
                                            tickets_sold: 0,
                                            isSolana: wallet.chain === 'SOL',
                                            isHuddle: true,
                                        }}
                                    />
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
                                onClick={() => {
                                    if (
                                        formDetails.title &&
                                        formDetails.category &&
                                        (formDetails.fee || !isPaid) &&
                                        formDetails.category.event_type &&
                                        formDetails.date
                                    ) {
                                        setSubmitting(true)
                                    }
                                }}
                                px="8"
                            >
                                Next Step
                            </Button>
                        </Flex>
                    </Box>
                </form>
            </>
        )
    } else
        return <Box textAlign={'center'}>Connect wallet before proceeding</Box>
}
