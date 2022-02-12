import {
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

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function Step2({
    event,
    onSubmit,
}: {
    onSubmit: Function
    event: any
}) {
    const [description, setDescription] = useState('')
    const [longDescription, setLongDescription] = useState('')
    const [wallet, setWallet] = useContext(walletContext)

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit({
                    description: {
                        short_desc: description,
                        long_desc: longDescription,
                    },
                })
            }}
        >
            <Box color="brand.black">
                <Text
                    align="center"
                    color="brand.black400"
                    fontSize="4xl"
                    fontWeight="semibold"
                >
                    Add some details
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
                            isRequired
                            borderBottom="2px"
                            borderBottomColor="gray.200"
                            _focusWithin={{ borderBottomColor: 'gray.300' }}
                        >
                            <FormLabel
                                fontSize={{ lg: 'md', xl: 'lg' }}
                                color="blackAlpha.700"
                                my="0"
                            >
                                Short Description
                            </FormLabel>

                            <Input
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                fontSize="sm"
                                value={description}
                                required
                                px="0"
                                _placeholder={{ color: 'gray.300' }}
                                placeholder="Short description of your event"
                                bg="transparent"
                                border="none"
                                rounded="none"
                                _hover={{}}
                                _focus={{}}
                                _active={{}}
                            />
                        </FormControl>

                        <FormControl
                            mt="8"
                            _focusWithin={{ borderBottomColor: 'gray.300' }}
                        >
                            <FormLabel
                                fontSize={{ lg: 'md', xl: 'lg' }}
                                color="blackAlpha.700"
                                my="0"
                                pb="4"
                            >
                                Long Description
                            </FormLabel>

                            <MDEditor
                                preview="edit"
                                value={longDescription}
                                onChange={(e: any) => {
                                    setLongDescription(String(e))
                                }}
                            />
                        </FormControl>
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
                                    title: event.title || 'Untitled',
                                    description: {
                                        short_desc:
                                            description ||
                                            'Event description goes here',
                                        long_desc: longDescription,
                                    },
                                    image: {
                                        image: '/assets/gradient.png',
                                        gallery: [],
                                    },
                                    date: event.date ? event.date : '1/1/2000',
                                    eventHost: wallet.address || '',
                                    owner: wallet.address || '',
                                    type: event.type || 'type',
                                    category: {
                                        category: [
                                            event.category?.category[0] ||
                                                'category',
                                        ],
                                        event_type: event.type || 'type',
                                    },
                                    buyers: [],

                                    fee: Number(event.fee),
                                    seats: event.seats,
                                    tickets_available: event.seats,
                                    tickets_sold: 0,
                                }}
                            />
                        </Box>
                    </Box>
                </Flex>
                <Box align="center" mt="10" mb="20">
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
                                _groupHover={{ transform: 'translateX(4px)' }}
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
                        Next Step
                    </Button>
                </Box>
            </Box>
        </form>
    )
}
