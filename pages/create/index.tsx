/* eslint-disable react-hooks/rules-of-hooks */
import {
    Box,
    Divider,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Image,
    Text,
    InputGroup,
    Input,
    InputRightElement,
    Button,
    InputLeftElement,
    Link,
    useClipboard,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { IoIosLink } from 'react-icons/io'
import Confetti from '../../components/Misc/Confetti.component'
import CreateEventCTA from '../../layouts/CreateEvent/CreateEventCTA.layout'
import Step1 from '../../layouts/CreateEvent/Step1.layout'
import Step2 from '../../layouts/CreateEvent/Step2.layout'
import Step3 from '../../layouts/CreateEvent/Step3.layout'
import Step4 from '../../layouts/CreateEvent/Step4.layout'
import Step5 from '../../layouts/CreateEvent/Step5.layout'
import { walletContext } from '../../utils/walletContext'
import { Event } from '../../types/Event.type'
import { ethers } from 'ethers'
import abi from '../../utils/MetapassFactory.json'

declare const window: any

const Create: NextPage = () => {
    const [wallet] = useContext(walletContext)
    const [step, setStep] = useState(0)
    const [event, setEvent] = useState<Event>({
        id: '',
        title: '',
        childAddress: '',
        category: {
            event_type: '',
            category: [''],
        },
        image: {
            image: '',
            gallery: [],
            video: '',
        },
        eventHost: '',
        fee: 0,
        date: '',
        description: {
            short_desc: '',
            long_desc: '',
        },
        seats: 0,
        owner: '',
        type: '',
        tickets_available: 0,
        tickets_sold: 0,
        buyers: [],
        link: '',
    })

    const contractAddress =
        process.env.NEXT_PUBLIC_ENV === 'dev'
            ? process.env.NEXT_PUBLIC_FACTORY_ADDRESS
            : process.env.NEXT_PUBLIC_FACTORY_ADDRESS_MAINNET
    let contract: any

    const [eventLink, setEventLink] = useState<any>(undefined)
    const [isPublished, setIsPublished] = useState(false)
    const [inTxn, setInTxn] = useState(false)
    const { hasCopied, onCopy } = useClipboard(eventLink)
    const [child, setChild] = useState<any>('')

    useEffect(() => {
        setEvent({
            ...event,
            owner: wallet.address,
        })
    }, [wallet])

    useEffect(() => {
        if (window.ethereum !== undefined && contractAddress) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            contract = new ethers.Contract(
                contractAddress as string,
                abi.abi,
                signer
            )
        }
    })

    const onSubmit = async () => {
        setInTxn(true)

        function b64EncodeUnicode(str: any) {
            return btoa(encodeURIComponent(str))
        }
        try {
            console.log('starting txn')
            console.log(contract)
            let txn = await contract?.createEvent(
                String(event.title),
                ethers.utils.parseEther(event.fee.toString()),
                Number(event.seats),
                b64EncodeUnicode(JSON.stringify(event.image)),
                wallet.address,
                b64EncodeUnicode(JSON.stringify(event.description)),
                event.link,
                event.date,
                b64EncodeUnicode(JSON.stringify(event.category)),
                'undefined'
            )
            txn.wait().then((res: any) => {
                let child = res.events.filter(
                    (e: any) => e.event === 'childEvent'
                )[0].args[0]
                setEventLink(`${window.location.origin}/event/${child}`)
                setIsPublished(true)
                setInTxn(false)
                setChild(child)
            })
        } catch (e) {
            console.log('error while txn')
            console.log(e)
        }
    }

    return (
        <>
            <Head>
                <title>MetaPass | Create Event</title>
            </Head>
            {isPublished && <Confetti />}
            <Modal isOpen={isPublished} onClose={() => {}}>
                <ModalOverlay />
                <ModalContent rounded="2xl">
                    <ModalBody textAlign="center">
                        <Image
                            src="/assets/elements/sparkle_3.svg"
                            alt="sparkle"
                            w="28"
                            mx="auto"
                            h="28"
                        />
                        <Text
                            fontFamily="body"
                            fontSize="xl"
                            color="blackAlpha.800"
                        >
                            Radical! 🎊
                        </Text>
                        <Box color="blackAlpha.700" fontSize="sm">
                            <Text mt="2">
                                {event.title} is live on Metapass!
                            </Text>
                            <Text>Spread the word, share this event via </Text>
                        </Box>
                        <Flex
                            mx="auto"
                            mt="2"
                            justify="center"
                            experimental_spaceX="2"
                            align="center"
                        >
                            <Box
                                p="2"
                                bg="white"
                                transitionDuration="100ms"
                                cursor="pointer"
                                boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                                rounded="full"
                                _hover={{ shadow: 'md' }}
                            >
                                <Image
                                    src="/assets/twitter.png"
                                    w="5"
                                    alt="twitter"
                                    onClick={() => {
                                        window.open(
                                            `http://twitter.com/share?text=I just created NFT Ticketed event for ${event.title} on metapass. Get your NFT Ticket now!&url=https://metapasshq.xyz/event/${child}`,
                                            '_blank'
                                        )
                                    }}
                                />
                            </Box>
                            <Box
                                p="2"
                                bg="white"
                                transitionDuration="100ms"
                                cursor="pointer"
                                boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                                rounded="full"
                                _hover={{ shadow: 'md' }}
                            >
                                <Image
                                    src="/assets/whatsapp.png"
                                    w="5"
                                    alt="whatsapp"
                                    onClick={() => {
                                        window.open(
                                            `https://api.whatsapp.com/send?text=I just created NFT Ticketed event for ${event.title} on metapass. Get your NFT Ticket now at https://metapasshq.xyz/event/${child}`
                                        )
                                    }}
                                />
                            </Box>
                            <Box
                                p="2"
                                bg="white"
                                transitionDuration="100ms"
                                cursor="pointer"
                                boxShadow="0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)"
                                rounded="full"
                                _hover={{ shadow: 'md' }}
                            >
                                <Image
                                    src="/assets/telegram.png"
                                    w="5"
                                    alt="telegram"
                                    onClick={() => {
                                        window.open(
                                            `https://telegram.me/share/url?url=https://metapasshq.xyz/event/${child}&text=I just created NFT Ticketed event for ${event.title} on metapass. Get your NFT Ticket now.`,
                                            '_blank'
                                        )
                                    }}
                                />
                            </Box>
                        </Flex>
                        <Text color="blackAlpha.700" fontSize="sm" mt="2">
                            Or copy link
                        </Text>
                        <InputGroup mt="4">
                            <InputLeftElement>
                                <IoIosLink />
                            </InputLeftElement>
                            <Input
                                rounded="full"
                                fontSize="xs"
                                value={eventLink}
                                readOnly
                            />
                            <InputRightElement mr="6">
                                <Button
                                    onClick={onCopy}
                                    _hover={{}}
                                    _focus={{}}
                                    _active={{}}
                                    rounded="full"
                                    color="white"
                                    bg="brand.gradient"
                                    fontWeight="normal"
                                    fontSize="sm"
                                    px="12"
                                    roundedBottomLeft="none"
                                >
                                    {hasCopied ? 'Copied' : 'Copy Link'}
                                </Button>
                            </InputRightElement>{' '}
                        </InputGroup>
                        <Box
                            p="1.5px"
                            mx="auto"
                            mt="6"
                            transitionDuration="200ms"
                            rounded="full"
                            w="fit-content"
                            boxShadow="0px 5px 33px rgba(0, 0, 0, 0.08)"
                            bg="brand.gradient"
                            _hover={{ transform: 'scale(1.05)' }}
                            _focus={{}}
                            _active={{ transform: 'scale(0.95)' }}
                        >
                            <Button
                                type="submit"
                                rounded="full"
                                bg="white"
                                size="sm"
                                color="blackAlpha.700"
                                fontWeight="medium"
                                _hover={{}}
                                leftIcon={
                                    <Box
                                        _groupHover={{
                                            transform: 'scale(1.1)',
                                        }}
                                        transitionDuration="200ms"
                                    >
                                        <Image
                                            src="/assets/elements/event_ticket_gradient.svg"
                                            w="4"
                                            alt="ticket"
                                        />
                                    </Box>
                                }
                                _focus={{}}
                                _active={{}}
                                onClick={() => {
                                    window.open(eventLink, '_blank')
                                }}
                                role="group"
                            >
                                Go to event page
                            </Button>
                        </Box>
                        <Box mt="2" mb="4">
                            <Link fontSize="sm" href="/" color="blackAlpha.600">
                                Back to home
                            </Link>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Box minH="100vh" h="full" overflowX="hidden">
                <CreateEventCTA step={step} setStep={setStep} />
                {wallet.address != null ? (
                    <Box mt="4">
                        <Box display={step === 0 ? 'block' : 'none'}>
                            {/* STEP1🔺 */}
                            <Step1
                                onSubmit={(formDetails: any) => {
                                    setEvent({
                                        ...event,
                                        ...formDetails,
                                    })

                                    setStep(1)
                                }}
                            />
                        </Box>
                        <Box display={step === 1 ? 'block' : 'none'}>
                            {/* STEP2🔺 */}
                            <Step2
                                event={event}
                                onSubmit={(formDetails: any) => {
                                    setEvent({
                                        ...event,
                                        ...formDetails,
                                    })

                                    setStep(2)
                                }}
                            />
                        </Box>
                        <Box display={step === 2 ? 'block' : 'none'}>
                            {/* STEP3🔺 */}
                            <Step3
                                event={event}
                                onSubmit={(formDetails: any) => {
                                    setEvent({
                                        ...event,
                                        ...formDetails,
                                    })

                                    setStep(3)
                                }}
                            />
                        </Box>
                        <Box display={step === 3 ? 'block' : 'none'}>
                            {/* STEP4🔺 */}
                            <Step4
                                event={event}
                                onSubmit={(link: any) => {
                                    setStep(4)
                                    setEvent({
                                        ...event,
                                        link,
                                    })
                                }}
                            />
                        </Box>
                        <Box display={step === 4 ? 'block' : 'none'}>
                            {/* STEP5🔺 */}
                            <Step5
                                event={event}
                                inTxn={inTxn}
                                onSubmit={() => {
                                    onSubmit()
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box textAlign={'center'}>
                        Connect wallet before proceeding
                    </Box>
                )}
            </Box>
        </>
    )
}

export default Create
