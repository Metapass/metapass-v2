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
import { walletContext, WalletType } from '../../utils/walletContext'
import { Event } from '../../types/Event.type'
import { ethers } from 'ethers'
import abi from '../../utils/MetapassFactory.json'
import MetapassABI from '../../utils/Metapass.json'
import { send } from '@metapasshq/msngr'
import axios from 'axios'
import { useMultichainProvider } from '../../hooks/useMultichainProvider'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
    AccountInfo,
    clusterApiUrl,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
} from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import {
    createInitializeHostInstruction,
    InitializeHostInstructionArgs,
    InitializeHostInstructionAccounts,
    createInitializeEventInstruction,
    idl,
    PROGRAM_ID,
    EventHostAccount,
} from 'metapass-sdk'
import toast from 'react-hot-toast'
import { MetapassProgram } from '../../types/MetapassProgram.types'
declare const window: any

const Create: NextPage = () => {
    const [wallet] = useContext<WalletType[]>(walletContext)
    const solanaWallet = useWallet()
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
        isHuddle: false,
        isSolana: false,
        displayName: '',
        profileImage: '',
        customSPLToken: '',
    })

    const contractAddress =
        process.env.NEXT_PUBLIC_ENV === 'dev'
            ? process.env.NEXT_PUBLIC_FACTORY_ADDRESS
            : process.env.NEXT_PUBLIC_FACTORY_ADDRESS_MAINNET

    let contract: any
    let program: anchor.Program<MetapassProgram>
    const [eventLink, setEventLink] = useState<any>(undefined)
    const [txnId, setTxnId] = useState<string | null>(null)
    const [isPublished, setIsPublished] = useState(false)
    const [inTxn, setInTxn] = useState(false)
    const { hasCopied, onCopy } = useClipboard(eventLink)
    const [child, setChild] = useState<any>('')
    const [multichainProvider] = useMultichainProvider(
        'POLYGON',
        wallet.address as string
    )
    useEffect(() => {
        setEvent({
            ...event,
            owner: wallet.address as string,
        })
    }, [wallet])

    useEffect(() => {
        try {
            if (
                window.ethereum !== undefined &&
                contractAddress &&
                wallet.chain === 'POLYGON'
            ) {
                const provider =
                    multichainProvider as ethers.providers.Web3Provider
                const signer = provider?.getSigner()

                contract = new ethers.Contract(
                    contractAddress as string,
                    abi.abi,
                    signer
                )
            } else {
                const provider = multichainProvider as anchor.AnchorProvider
                const prog = new anchor.Program(
                    idl as anchor.Idl,
                    PROGRAM_ID,
                    provider
                ) as unknown
                program = prog as anchor.Program<MetapassProgram>
            }
        } catch (error) {
            console.log(error)
        }
    })

    const onPolygonSubmit = async () => {
        setInTxn(true)

        function b64EncodeUnicode(str: any) {
            return btoa(encodeURIComponent(str))
        }
        if (!event.isHuddle) {
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
                txn.wait().then(async (res: any) => {
                    let child = res.events.filter(
                        (e: any) => e.event === 'childEvent'
                    )[0].args[0]
                    if (event.fee == 0) {
                        await axios({
                            method: 'post',
                            url: 'https://api.biconomy.io/api/v1/smart-contract/public-api/addContract',
                            data: {
                                contractName: event.title,
                                contractAddress: child,
                                contractType: 'SC',
                                abi: JSON.stringify(MetapassABI.abi),
                                walletType: '',
                                metaTransactionType: 'TRUSTED_FORWARDER',
                            },
                            headers: {
                                authToken: process.env
                                    .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                                apiKey: process.env
                                    .NEXT_PUBLIC_BICONOMY_API as string,
                            },
                        })
                        await axios({
                            method: 'post',
                            url: 'https://api.biconomy.io/api/v1/meta-api/public-api/addMethod',
                            data: {
                                name: event.title,
                                apiType: 'native',
                                methodType: 'write',
                                contractAddress: child,
                                method: 'getTix',
                            },
                            headers: {
                                authToken: process.env
                                    .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                                apiKey: process.env
                                    .NEXT_PUBLIC_BICONOMY_API as string,
                            },
                        })
                    }
                    setEventLink(`${window.location.origin}/event/${child}`)
                    setIsPublished(true)
                    setInTxn(false)
                    setChild(child)
                })
            } catch (err: any) {
                console.log('error while txn', err)
                setInTxn(false)
            }
        } else {
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
                    '',
                    event.date,
                    b64EncodeUnicode(JSON.stringify(event.category)),
                    'undefined'
                )
                txn.wait().then(async (res: any) => {
                    let child = res.events.filter(
                        (e: any) => e.event === 'childEvent'
                    )[0].args[0]
                    if (event.fee == 0) {
                        console.log('adding contract')
                        let c = await axios({
                            method: 'post',
                            url: 'https://api.biconomy.io/api/v1/smart-contract/public-api/addContract',
                            data: {
                                contractName: event.title,
                                contractAddress: child,
                                contractType: 'SC',
                                abi: JSON.stringify(MetapassABI.abi),
                                walletType: '',
                                metaTransactionType: 'TRUSTED_FORWARDER',
                            },
                            headers: {
                                authToken: process.env
                                    .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                                apiKey: process.env
                                    .NEXT_PUBLIC_BICONOMY_API as string,
                            },
                        })
                        console.log('adding API')
                        let a = await axios({
                            method: 'post',
                            url: 'https://api.biconomy.io/api/v1/meta-api/public-api/addMethod',
                            data: {
                                name: event.title,
                                apiType: 'native',
                                methodType: 'write',
                                contractAddress: child,
                                method: 'getTix',
                            },
                            headers: {
                                authToken: process.env
                                    .NEXT_PUBLIC_BICONOMY_DASH_API as string,
                                apiKey: process.env
                                    .NEXT_PUBLIC_BICONOMY_API as string,
                            },
                        })
                        console.log('generating huddle')
                        console.log({
                            title: event.title,
                            host: event.owner,
                            childAddress: child,
                        })
                        let roomLink = await axios.post(
                            process.env.NEXT_PUBLIC_HUDDLE_API as string,
                            {
                                title: event.title,
                                host: event.owner,
                                contractAddress: child,
                            }
                        )
                        try {
                            console.log(roomLink.data)
                            await contract.updateLink(
                                child,
                                roomLink.data.meetingLink
                            )
                        } catch (e) {
                            console.log('error making huddle room ', e)
                        }
                    } else {
                        let roomLink = await axios.post(
                            process.env.NEXT_PUBLIC_HUDDLE_API as string,
                            {
                                title: event.title,
                                host: event.owner,
                                contractAddress: child,
                            }
                        )
                        try {
                            console.log(roomLink.data)
                            await contract.updateLink(
                                child,
                                roomLink.data.meetingLink
                            )
                        } catch (e) {
                            console.log('error making huddle room ', e)
                        }
                    }
                    setEventLink(`${window.location.origin}/event/${child}`)
                    setIsPublished(true)
                    setInTxn(false)
                    setChild(child)
                })
            } catch (err: any) {
                console.log('error while txn', err)
                setInTxn(false)
            }
        }
    }

    const onSolanaSubmit = async () => {
        const wallet = solanaWallet
        const connection = new Connection(
            clusterApiUrl(
                process.env.NEXT_PUBLIC_ENV == 'prod'
                    ? 'mainnet-beta'
                    : 'mainnet-beta'
            )
        )
        setInTxn(true)

        if (wallet.publicKey && program) {
            console.log('starting txn', event)
            // return
            const [hostPDA, hostBump] = await PublicKey.findProgramAddress(
                [
                    anchor.utils.bytes.utf8.encode('event-host-key'),
                    wallet.publicKey.toBuffer(),
                ],
                PROGRAM_ID
            )
            console.log('host', hostPDA.toString(), program)
            let hostExist = await connection.getAccountInfo(hostPDA)
            console.log(hostExist, 'hoste')
            if (hostExist == null) {
                try {
                    const accounts1: InitializeHostInstructionAccounts = {
                        eventHostAccount: hostPDA,
                        authority: wallet.publicKey,
                    }
                    const args: InitializeHostInstructionArgs = {
                        displayName: event.displayName as string,
                        profileImg: event.profileImage as string,
                    }

                    const transactionInstruction1 =
                        createInitializeHostInstruction(accounts1, args)

                    const transaction1 = new Transaction().add(
                        transactionInstruction1
                    )
                    const { blockhash } = await connection.getLatestBlockhash()
                    transaction1.recentBlockhash = blockhash
                    transaction1.feePayer = wallet.publicKey
                    if (wallet.signTransaction) {
                        const signedTx = await wallet.signTransaction(
                            transaction1
                        )
                        const txid = await connection.sendRawTransaction(
                            signedTx.serialize()
                        )
                        console.log(
                            'Host created',
                            `https://solscan.io/tx/${txid}`
                        )
                    } else {
                        throw Error(
                            'signTransaction is undefined, line 205 create/index.tsx'
                        )
                    }

                    let nonce = '0' // if new host is created obviously the nonce is zero
                    const [eventPDA, _] = await PublicKey.findProgramAddress(
                        [
                            anchor.utils.bytes.utf8.encode('event_account'),
                            wallet.publicKey.toBuffer(),
                            new anchor.BN(nonce).toArrayLike(Buffer),
                        ],
                        PROGRAM_ID
                    )

                    console.log(hostPDA.toString(), nonce, eventPDA.toString())

                    const accounts = {
                        eventAccount: eventPDA,
                        authority: wallet.publicKey,
                        eventHostAccount: hostPDA,
                    }
                    const CST = new PublicKey(
                        (event.customSPLToken as string) ??
                            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
                    )
                    const transactionData = {
                        createEventInfo: {
                            title: event.title,
                            description: JSON.stringify(event.description),
                            uri: 'https://arweave.net/AhzTMchxDglQbfLWzQHOOGV9BA-CeEy36C-DJwFfqUc', // @deprecated
                            link: event.link as string,
                            fee: new anchor.BN(
                                (event.fee as number) * LAMPORTS_PER_SOL
                            ),
                            seats: new anchor.BN(event.seats as number),
                            date: event.date,
                            venue: event.type,
                            isCutPayedByCreator: true,
                            isCustomSplToken: event.customSPLToken
                                ? true
                                : false,
                            customSplToken: CST,
                        },
                    }
                    const txnInstruction = createInitializeEventInstruction(
                        accounts,
                        transactionData
                    )
                    const transaction = new Transaction().add(txnInstruction)
                    const signature = await wallet.sendTransaction(
                        transaction,
                        connection
                    )
                    console.log('tx sign', signature)
                    setEventLink(
                        window.location.origin + '/event/' + eventPDA.toString()
                    )
                    setTxnId(signature)
                    await axios.post(
                        `https://cors-anywhere-production-4dbd.up.railway.app/${process.env.NEXT_PUBLIC_MONGO_API}/create`,
                        {
                            id: nonce,
                            title: event.title,
                            category: JSON.stringify(event.category),
                            image: JSON.stringify(event.image),
                            eventPDA: eventPDA.toString(),
                            eventHost: wallet.publicKey.toString(),
                            date: event.date,
                            description: JSON.stringify(event.description),
                            seats: event.seats,
                            type: event.category.event_type,
                            link: event.link,
                            fee: event.fee,
                        }
                    )
                    setIsPublished(true)
                    setInTxn(false)
                } catch (error) {
                    console.log('error', error)
                }
            } else {
                try {
                    console.log('host', hostPDA.toBase58())
                    let host = await connection.getAccountInfo(hostPDA)
                    let nonce = EventHostAccount.deserialize(
                        host?.data as Buffer
                    )[0].eventHostStruct.eventCount.toString()

                    console.log('host', host, hostPDA.toBase58(), nonce)

                    const [eventPDA, _] = await PublicKey.findProgramAddress(
                        [
                            anchor.utils.bytes.utf8.encode('event_account'),
                            wallet.publicKey.toBuffer(),
                            new anchor.BN(nonce).toArrayLike(Buffer),
                        ],
                        PROGRAM_ID
                    )
                    const accounts = {
                        eventAccount: eventPDA,
                        authority: wallet.publicKey,
                        eventHostAccount: hostPDA,
                    }
                    console.log(
                        event.customSPLToken,
                        event.customSPLToken ||
                            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                        'CST'
                    )
                    const CST = new PublicKey(
                        event.customSPLToken ||
                            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
                    )
                    const transactionData = {
                        createEventInfo: {
                            title: event.title,
                            description: JSON.stringify(event.description),
                            uri: 'https://arweave.net/AhzTMchxDglQbfLWzQHOOGV9BA-CeEy36C-DJwFfqUc', //@deprecated
                            link: event.link as string,
                            fee: new anchor.BN(
                                (event.fee as number) * LAMPORTS_PER_SOL // have to change this for custom where decimals are not same
                            ),
                            seats: new anchor.BN(event.seats as number),
                            date: event.date,
                            venue: event.type,
                            isCutPayedByCreator: true,
                            isCustomSplToken: event.customSPLToken
                                ? true
                                : false,
                            customSplToken: CST,
                        },
                    }
                    const txnInstruction = createInitializeEventInstruction(
                        accounts,
                        transactionData
                    )
                    const transaction = new Transaction().add(txnInstruction)
                    const signature = await wallet.sendTransaction(
                        transaction,
                        connection
                    )
                    console.log('tx sign', signature)
                    setEventLink(
                        window.location.origin + '/event/' + eventPDA.toString()
                    )
                    setTxnId(signature)

                    await axios.post(
                        `https://cors-anywhere-production-4dbd.up.railway.app/${process.env.NEXT_PUBLIC_MONGO_API}/create`,
                        {
                            id: nonce,
                            title: event.title,
                            category: JSON.stringify(event.category),
                            image: JSON.stringify(event.image),
                            eventPDA: eventPDA.toString(),
                            eventHost: wallet.publicKey.toString(),
                            date: event.date,
                            description: JSON.stringify(event.description),
                            seats: event.seats,
                            type: event.category.event_type,
                            link: event.link,
                            fee: event.fee,
                        }
                    )

                    setIsPublished(true)
                    setInTxn(false)
                } catch (error) {
                    console.log('error', error)
                }
            }
        } else {
            toast('Connect your solana wallet')
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
                                            `http://twitter.com/share?text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now!&url=https://app.metapasshq.xyz/event/${child}`,
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
                                            `https://api.whatsapp.com/send?text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now at https://app.metapasshq.xyz/event/${child}`
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
                                            `https://telegram.me/share/url?url=https://app.metapasshq.xyz/event/${child}&text=I just created NFT Ticketed event for ${event.title} on Metapass. Get your NFT Ticket now.`,
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
                                        isSolana: wallet.chain === 'SOL',
                                    })

                                    setStep(1)
                                }}
                                systemWallet={wallet}
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
                                onSubmit={(link: any, huddle: boolean) => {
                                    setStep(4)
                                    setEvent({
                                        ...event,
                                        link,
                                        isHuddle: huddle,
                                    })
                                }}
                            />
                        </Box>
                        <Box display={step === 4 ? 'block' : 'none'}>
                            {/* STEP5🔺 */}
                            <Step5
                                event={event}
                                inTxn={inTxn}
                                onSubmit={
                                    wallet.chain === 'SOL'
                                        ? onSolanaSubmit
                                        : onPolygonSubmit
                                }
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
