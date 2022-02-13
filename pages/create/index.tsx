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
import { SetStateAction, useContext, useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { IoIosLink } from 'react-icons/io'
import useWindowSize from 'react-use/lib/useWindowSize'
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
        // price: 0,
        type: '',
        tickets_available: 0,
        tickets_sold: 0,
        buyers: [],
        // slides: [],
        link: '',
    })

    const contractAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS
    let contract: any

    const [eventLink, setEventLink] = useState<any>(undefined)
    const [isPublished, setIsPublished] = useState(false)
    const { hasCopied, onCopy } = useClipboard(eventLink)

    useEffect(() => {
        setEvent({
            ...event,
            owner: wallet.address,
        })
    }, [wallet])

    useEffect(() => {
        if (window.ethereum !== undefined) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            contract = new ethers.Contract(
                contractAddress as string,
                abi.abi,
                signer
            )
        }
        console.log(contract)
    })

    const onSubmit = async () => {
        console.log(event)

        let imgJson = {
            image: event.image,
            gallery: event.image.gallery,
        }

        try {
            let txn = await contract.createEvent(
                event.title,
                ethers.utils.parseEther(event.fee.toString()),
                10,
                btoa(JSON.stringify(imgJson)),
                wallet.address,
                btoa(JSON.stringify(event.description)),
                event.link,
                event.date,
                btoa(JSON.stringify(event.category))
            )
            console.log(txn)
        } catch (e) {
            console.log(e)
        }

        console.log('Event Created')

        contract.on('childEvent', (child: any) => {
            setEventLink(`${window.location.origin}/events/${child}`)
            setIsPublished(true)
        })
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
                                    src="/assets/discord.svg"
                                    w="5"
                                    alt="discord"
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
                                    src="/assets/instagram.webp"
                                    w="5"
                                    alt="instagram"
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
                            <Link
                                fontSize="sm"
                                href="/events"
                                color="blackAlpha.600"
                            >
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
