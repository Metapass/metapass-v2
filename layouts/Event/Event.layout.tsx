import {
    AspectRatio,
    Box,
    Flex,
    Text,
    Image,
    Button,
    Divider,
    Avatar,
    AvatarGroup,
} from '@chakra-ui/react'
import { useState, useContext } from 'react'
import ReactPlayer from 'react-player'
import { Event } from '../../types/Event.type'
import { getParameterByName } from '../../utils/queryExtractor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import gravatarUrl from 'gravatar-url'
import { walletContext } from '../../utils/walletContext'
import { ethers } from 'ethers'
import abi from '../../utils/Metapass.json'
import youtubeThumbnail from 'youtube-thumbnail'

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
    ssr: false,
})
import { ImageType } from '../../types/Event.type'
import toast from 'react-hot-toast'

declare const window: any

export default function EventLayout({ event }: { event: Event }) {
    const [image, setImage] = useState(event.image.image)
    const [mediaType, setMediaType] = useState(
        event.image.video ? 'video' : 'image'
    )
    const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
    ]

    const [wallet] = useContext(walletContext)

    const buyTicket = async () => {
        if (wallet.address != null) {
            if (typeof window.ethereum != undefined) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = provider.getSigner()
                let metapass = new ethers.Contract(
                    event.childAddress,
                    abi.abi,
                    signer
                )
                console.log(metapass)

                try {
                    metapass.getTix('metadata', {
                        value: ethers.utils.parseEther(event.fee.toString()),
                    })
                } catch (e: any) {
                    toast(
                        'An error occured! Share error code: ' +
                            e.code +
                            ' with the team for reference.'
                    )
                }
            } else {
                console.log("Couldn't find ethereum enviornment")
            }
        } else {
            toast('Please connect your wallet')
        }
    }

    return (
        <Box pt="3" color="brand.black" mb="4">
            <Flex
                justify="space-between"
                align="center"

                //   border="1px solid red"
            >
                <Box>
                    <Text fontSize="2xl" fontWeight="semibold">
                        {event.title}
                    </Text>
                    <Flex experimental_spaceX="2" color="blackAlpha.600" mt="1">
                        <Box
                            boxShadow="0px 0px 31.1248px rgba(0, 0, 0, 0.08)"
                            rounded="full"
                            fontSize="10px"
                            fontWeight="semibold"
                            border="1px"
                            borderColor="blackAlpha.200"
                            px="2"
                            py="0.5"
                            bg="white"
                        >
                            {event.type || event.category.event_type}
                        </Box>
                        <Box
                            boxShadow="0px 0px 31.1248px rgba(0, 0, 0, 0.08)"
                            rounded="full"
                            fontSize="10px"
                            fontWeight="semibold"
                            border="1px"
                            borderColor="blackAlpha.200"
                            px="2"
                            py="0.5"
                            bg="white"
                        >
                            {Array(event.category.category).join(' & ')}
                        </Box>
                    </Flex>
                </Box>
                <Button
                    rounded="full"
                    bg="brand.gradient"
                    fontWeight="medium"
                    role="group"
                    boxShadow="0px 4px 32px rgba(0, 0, 0, 0.12)"
                    color="white"
                    _disabled={{ opacity: '0.8', cursor: 'not-allowed' }}
                    _hover={{}}
                    onClick={buyTicket}
                    disabled={event.tickets_available <= event.tickets_sold}
                    _focus={{}}
                    _active={{}}
                    mr="3"
                    leftIcon={
                        <Box
                            _groupHover={{ transform: 'scale(1.1)' }}
                            transitionDuration="200ms"
                        >
                            <Image
                                src="/assets/elements/event_ticket.svg"
                                w="5"
                                alt="ticket"
                            />
                        </Box>
                    }
                >
                    {event.tickets_available === event.tickets_sold
                        ? 'Sold Out'
                        : 'Buy Ticket'}
                </Button>
            </Flex>
            <Flex
                align="start"
                mt="4"
                experimental_spaceX="6"
                justify="space-between"
            >
                <Box w="full">
                    <Box
                        w="full"
                        overflow="clip"
                        border="1px"
                        borderColor="blackAlpha.100"
                        boxShadow="0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)"
                        rounded="xl"
                        p="3"
                    >
                        <Flex alignItems="end" experimental_spaceX="4">
                            <AspectRatio
                                ratio={16 / 9}
                                w="full"
                                rounded="lg"
                                overflow="hidden"
                            >
                                {mediaType === 'video' ? (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        w="full"
                                    >
                                        <ReactPlayer
                                            height="100%"
                                            width="100%"
                                            url={event.image.video}
                                        />
                                    </Flex>
                                ) : (
                                    <Image src={image} alt={'Event Image'} /> // @ts-ignore
                                )}
                            </AspectRatio>
                            <Box
                                maxH={{ base: '26vw', xl: '300px' }}
                                minW={{ md: '100px', lg: '130px' }}
                                overflowY="auto"
                            >
                                <Flex
                                    px="1"
                                    py="1"
                                    direction="column"
                                    minW={{ md: '90px', lg: '110px' }}
                                    experimental_spaceY="2"
                                >
                                    {event.image.video && (
                                        <AspectRatio
                                            cursor="pointer"
                                            _hover={{
                                                filter: 'brightness(90%)',
                                            }}
                                            transitionDuration="100ms"
                                            onClick={() => {
                                                setMediaType('video')
                                            }}
                                            ratio={16 / 9}
                                            w="full"
                                            ringColor="brand.peach"
                                            ring={
                                                mediaType === 'video'
                                                    ? '2px'
                                                    : 'none'
                                            }
                                            rounded="md"
                                            overflow="hidden"
                                        >
                                            <Image
                                                src={
                                                    youtubeThumbnail(
                                                        event.image.video
                                                    )
                                                        ? youtubeThumbnail(
                                                              event.image.video
                                                          )
                                                        : 'https://pdtxar.com/wp-content/uploads/2019/11/video-placeholder-1280x720-40-768x433.jpg'
                                                }
                                                alt={'thumbnail'}
                                            />
                                        </AspectRatio>
                                    )}
                                    {/* {console.log(image.hero_image,"hero_image")} */}
                                    {event.image.gallery?.map((data, key) => (
                                        <AspectRatio
                                            key={key}
                                            cursor="pointer"
                                            _hover={{
                                                filter: 'brightness(90%)',
                                            }}
                                            transitionDuration="100ms"
                                            onClick={() => {
                                                setImage(data)
                                                setMediaType('image')
                                            }}
                                            ratio={16 / 9}
                                            w="full"
                                            ringColor="brand.peach"
                                            ring={
                                                image === data &&
                                                mediaType === 'image'
                                                    ? '2px'
                                                    : 'none'
                                            }
                                            rounded="md"
                                            overflow="hidden"
                                        >
                                            <Image src={data} alt={data} />
                                        </AspectRatio>
                                    ))}
                                </Flex>
                            </Box>
                        </Flex>
                    </Box>
                    <Box
                        w="full"
                        mt="2"
                        noOfLines={6}
                        border="1px"
                        borderColor="blackAlpha.100"
                        boxShadow="0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)"
                        rounded="xl"
                        p="3"
                        fontFamily="body"
                        px="4"
                        color="blackAlpha.700"
                        fontSize={{ base: 'sm', lg: 'md' }}
                        // minH={{ base: '28', xl: '28' }}
                        // maxW="10%"
                        // h="10rem"
                        maxH="10rem"
                        maxW="740px"
                        overflow="auto"
                    >
                        <Box>
                            <MarkdownPreview
                                style={{
                                    fontSize: event.description.long_desc
                                        ? '12px'
                                        : '14px',
                                    overflow: 'auto',
                                }}
                                source={
                                    event.description.long_desc ||
                                    event.description.short_desc
                                }
                            />
                        </Box>
                    </Box>
                </Box>
                <Flex direction="column">
                    <Flex experimental_spaceX="2.5">
                        <Box
                            p="2"
                            border="1px"
                            borderColor="blackAlpha.100"
                            rounded="xl"
                            textAlign="center"
                            minW="100px"
                            boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                        >
                            <Text fontSize="xs" color="blackAlpha.700">
                                Ticket Price
                            </Text>
                            <Divider my="2" />
                            <Box w="fit-content" mx="auto">
                                <Image
                                    src="/assets/matic.png"
                                    alt="matic"
                                    w="6"
                                    h="6"
                                />
                            </Box>
                            <Text
                                fontSize={event.fee === 0 ? 'lg' : '2xl'}
                                fontWeight="semibold"
                                mt={event.fee === 0 ? '1.5' : '0'}
                            >
                                {event.fee === 0 ? 'FREE' : event.fee}
                            </Text>
                        </Box>
                        <Box
                            p="2"
                            border="1px"
                            borderColor="blackAlpha.100"
                            rounded="xl"
                            textAlign="center"
                            minW="100px"
                            boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                        >
                            <Text fontSize="xs" color="blackAlpha.700">
                                Event Date
                            </Text>
                            <Divider my="2" />
                            <Text color="brand.peach">
                                {months[new Date(event.date).getMonth()]}
                            </Text>
                            <Text fontSize="2xl" fontWeight="semibold">
                                {new Date(event.date).getDate()}
                            </Text>
                        </Box>
                    </Flex>
                    <Box
                        mt="3"
                        rounded="xl"
                        px="4"
                        border="1px"
                        borderColor="blackAlpha.100"
                        boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                        py="2"
                    >
                        <Text color="blackAlpha.500" fontSize="xs">
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
                                <Avatar
                                    size="xs"
                                    src={gravatarUrl(
                                        event.owner ||
                                            event.eventHost ||
                                            '0x565b7af7b3c9a5d005ccb39bbf21e07a1ad4cd42',
                                        {
                                            default: 'retro',
                                        }
                                    )}
                                />
                                <Box>
                                    <Text fontSize="14px">
                                        {event.owner.substring(0, 6) +
                                            '...' +
                                            event.owner.substring(
                                                event.owner.length - 6
                                            )}
                                    </Text>
                                </Box>
                            </Flex>
                        </Flex>
                    </Box>
                    <Box
                        mt="3"
                        rounded="xl"
                        px="4"
                        border="1px"
                        borderColor="blackAlpha.100"
                        boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                        py="2"
                    >
                        <Text color="blackAlpha.500" fontSize="xs">
                            Recent Buyers
                        </Text>
                        {event.buyers.length > 0 ? (
                            <AvatarGroup
                                mt="2"
                                size="sm"
                                max={6}
                                fontSize="xs"
                                spacing={-2}
                            >
                                {event.buyers?.reverse().map((data, key) => {
                                    const { id }: any = data
                                    console.log(data)
                                    return (
                                        <Avatar
                                            src={gravatarUrl(
                                                id?.toString() || '1',
                                                {
                                                    default: 'retro',
                                                }
                                            )}
                                            key={key}
                                            cursor="pointer"
                                            _hover={{ zIndex: 10 }}
                                        />
                                    )
                                })}
                            </AvatarGroup>
                        ) : (
                            <Text fontSize={13}>
                                You're the first one here!
                            </Text>
                        )}
                    </Box>
                    <Box
                        mt="3"
                        rounded="xl"
                        px="4"
                        border="1px"
                        borderColor="blackAlpha.100"
                        boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                        py="2"
                    >
                        <Flex justify="space-between" align="center">
                            <Text color="blackAlpha.500" fontSize="xs">
                                Tickets Sold
                            </Text>
                            <Flex fontSize="xs" align="center">
                                <Text
                                    fontWeight="bold"
                                    style={{
                                        background:
                                            '-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {event.tickets_sold}
                                </Text>
                                <Text fontSize="xx-small">/</Text>
                                <Text> {event.seats}</Text>
                            </Flex>
                        </Flex>
                        <Box
                            w="full"
                            h="4"
                            bg="blackAlpha.50"
                            mt="2"
                            rounded="full"
                            mb="1"
                            overflow="hidden"
                        >
                            <Box
                                w={`${
                                    (event.tickets_sold /
                                        (event.seats + event.tickets_sold)) *
                                    100
                                }%`}
                                h="full"
                                bg="brand.gradient"
                            />
                        </Box>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
}
