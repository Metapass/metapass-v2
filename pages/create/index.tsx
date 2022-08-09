/* eslint-disable react-hooks/rules-of-hooks */
import { Box, useClipboard } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import Confetti from '../../components/Misc/Confetti.component'
import CreateEventCTA from '../../layouts/CreateEvent/CreateEventCTA.layout'
import Step1 from '../../layouts/CreateEvent/Step1.layout'
import Step2 from '../../layouts/CreateEvent/Step2.layout'
import Step3 from '../../layouts/CreateEvent/Step3.layout'
import Step4 from '../../layouts/CreateEvent/Step4.layout'
import SubmitStep from '../../layouts/CreateEvent/SubmitStep.layout'
import { walletContext, WalletType } from '../../utils/walletContext'

import { Event, VenueType } from '../../types/Event.type'
import { ethers } from 'ethers'
import abi from '../../utils/MetapassFactory.json'
import MetapassABI from '../../utils/Metapass.json'
import axios from 'axios'
import { supabase } from '../../lib/config/supabaseConfig'

import { useMultichainProvider } from '../../hooks/useMultichainProvider'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
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
import { useAccount } from 'wagmi'
import { useRecoilState, useRecoilValue } from 'recoil'
import { inviteOnlyAtom, stepAtom, formDetails } from '../../lib/recoil/atoms'
import Step5 from '../../layouts/CreateEvent/Step5.layout'
import EventCreatedModal from '../../components/Modals/EventCreated.modal'
import { defaultFormData, eventData } from '../../lib/constants'
import { polygonEventHandler } from '../../utils/helpers/onPolygonSubmit'
import { formType } from '../../types/registerForm.types'
declare const window: any

const Create: NextPage = () => {
    const [wallet] = useContext<WalletType[]>(walletContext)
    const solanaWallet = useWallet()
    const [step, setStep] = useRecoilState(stepAtom)
    const isInviteOnly = useRecoilValue(inviteOnlyAtom)
    const [isSolHost, setIsSolHost] = useState<Boolean>(true)
    const [event, setEvent] = useState<Event>(eventData)

    const [formData, setFormData] = useRecoilState(formDetails)

    const contractAddress =
        process.env.NEXT_PUBLIC_ENV === 'dev'
            ? process.env.NEXT_PUBLIC_FACTORY_ADDRESS
            : process.env.NEXT_PUBLIC_FACTORY_ADDRESS_MAINNET

    const [contract, setContract] = useState<any>()

    // let contract: any
    const [program, setProgram] = useState<anchor.Program<MetapassProgram>>()
    const [eventLink, setEventLink] = useState<any>(undefined)
    const [txnId, setTxnId] = useState<string | null>(null)
    const [isPublished, setIsPublished] = useState(false)
    const [inTxn, setInTxn] = useState<boolean>(false)
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
    }, [])

    const { isConnected } = useAccount()

    useEffect(() => {
        try {
            if (isConnected) {
                const provider =
                    multichainProvider as ethers.providers.Web3Provider
                const signer = provider?.getSigner()

                setContract(
                    new ethers.Contract(
                        contractAddress as string,
                        abi.abi,
                        signer
                    )
                )
            } else {
                const provider = multichainProvider as anchor.AnchorProvider
                const prog = new anchor.Program(
                    idl as anchor.Idl,
                    PROGRAM_ID,
                    provider
                ) as unknown
                setProgram(prog as any)
            }
        } catch (error) {
            console.log(error)
        }
    }, [wallet, contractAddress, isConnected, multichainProvider])

    const uploadFormDetails = async (form: formType, child: string) => {
        const { data, error } = await supabase.from('forms').insert({
            event: child,
            data: form,
        })

        error ? console.log(error) : console.log(data)
    }

    const onPolygonSubmit = async () => {
        setInTxn(true)

        function b64EncodeUnicode(str: any) {
            return btoa(encodeURIComponent(str))
        }
        console.log(event, 'event')
        // const { data, error } = await supabase.from('events').insert({
        //     contractAddress: '0x1',
        //     inviteOnly: false,
        //     Venue: JSON.stringify(event.venue),
        // })

        if (!event.isHuddle) {
            try {
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
                    b64EncodeUnicode(JSON.stringify(event.venue))
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
                    const { data, error } = await supabase
                        .from('events')
                        .insert({
                            contractAddress: child,
                            inviteOnly: isInviteOnly,
                            Venue: JSON.stringify(event.venue),
                            IRL: event.category.event_type === 'In-Person',
                        })
                    setEventLink(`${window.location.origin}/event/${child}`)
                    setIsPublished(true)
                    setInTxn(false)
                    setChild(child)
                    if (isInviteOnly) {
                        uploadFormDetails(formData, child)
                    }
                    setFormData(defaultFormData)
                })
            } catch (err: any) {
                setInTxn(false)
                setIsPublished(false)
                toast.error('Oops! Couldnt create event')
            }
        } else {
            try {
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
                        let roomLink = await axios.post(
                            process.env.NEXT_PUBLIC_HUDDLE_API as string,
                            {
                                title: event.title,
                                host: event.owner,
                                contractAddress: child,
                            }
                        )
                        try {
                            await contract.updateLink(
                                child,
                                roomLink.data.meetingLink
                            )
                        } catch (e) {}
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
                            await contract.updateLink(
                                child,
                                roomLink.data.meetingLink
                            )
                        } catch (e) {}
                    }
                    const { data, error } = await supabase
                        .from('events')
                        .insert({
                            contractAddress: child,
                            inviteOnly: isInviteOnly,
                            Venue: JSON.stringify(event.venue),
                            IRL: event.category.event_type === 'In-Person',
                        })
                    setEventLink(`${window.location.origin}/event/${child}`)
                    setIsPublished(true)
                    setInTxn(false)
                    setChild(child)
                    if (isInviteOnly) {
                        uploadFormDetails(formData, child)
                    }
                    setFormData(defaultFormData)
                })
            } catch (err: any) {
                setInTxn(false)
                setIsPublished(false)
                toast.error('Oops! Couldnt create Event')
            }
        }
    }

    useEffect(() => {
        ;(async function () {
            const connection = new Connection(
                process.env.NEXT_PUBLIC_ENV == 'prod'
                    ? clusterApiUrl('mainnet-beta')
                    : clusterApiUrl('mainnet-beta')
            )
            if (solanaWallet.publicKey) {
                const [hostPDA, hostBump] = await PublicKey.findProgramAddress(
                    [
                        anchor.utils.bytes.utf8.encode('event-host-key'),
                        solanaWallet.publicKey.toBuffer(),
                    ],
                    PROGRAM_ID
                )
                let hostExist = await connection.getAccountInfo(hostPDA)
                setIsSolHost(!(hostExist == null))
            }
        })()
    }, [solanaWallet.publicKey])

    const onSolanaSubmit = async () => {
        const wallet = solanaWallet
        console.log(wallet.publicKey, program)
        const connection = new Connection(
            process.env.NEXT_PUBLIC_ENV == 'prod'
                ? clusterApiUrl('mainnet-beta')
                : clusterApiUrl('mainnet-beta')
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
            let hostExist = await connection.getAccountInfo(hostPDA)
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
                    console.log(transactionData)
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
                    try {
                        await axios.post(`/api/create`, {
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
                            venue: JSON.stringify(event.venue),
                        })
                    } catch (e) {
                        console.log('create api')
                    }
                    const { data, error } = await supabase
                        .from('events')
                        .insert({
                            contractAddress: eventPDA.toString(),
                            inviteOnly: isInviteOnly,
                            Venue: JSON.stringify(event.venue),
                            IRL: event.category.event_type === 'In-Person',
                        })
                    setIsPublished(true)
                    setInTxn(false)
                    if (isInviteOnly) {
                        uploadFormDetails(formData, child)
                    }
                    setFormData(defaultFormData)
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
                    let CST
                    if (event.fee === 0) {
                        CST = new PublicKey(
                            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
                        )
                    } else {
                        CST = new PublicKey(event.customSPLToken as string)
                    }

                    const transactionData = {
                        createEventInfo: {
                            title: event.title,
                            description: JSON.stringify(event.description),
                            uri: 'https://arweave.net/AhzTMchxDglQbfLWzQHOOGV9BA-CeEy36C-DJwFfqUc', //@deprecated
                            link: event.link as string,
                            fee: new anchor.BN(
                                (event.fee as number) * 10 ** 6 // have to change this for custom where decimals are not same
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
                    console.log(transactionData)
                    const txnInstruction = createInitializeEventInstruction(
                        accounts,
                        transactionData
                    )
                    const transaction = new Transaction().add(txnInstruction)
                    // const signature = await wallet.sendTransaction(
                    //     transaction,
                    //     connection
                    // )
                    const { blockhash } = await connection.getLatestBlockhash()
                    transaction.recentBlockhash = blockhash
                    transaction.feePayer = wallet.publicKey
                    if (wallet.signTransaction) {
                        const signedTx = await wallet.signTransaction(
                            transaction
                        )
                        const txid = await connection.sendRawTransaction(
                            signedTx.serialize()
                        )
                        console.log(
                            'Event created',
                            `https://solscan.io/tx/${'txid'}`
                        )
                        setEventLink(
                            window.location.origin +
                                '/event/' +
                                eventPDA.toString()
                        )
                        setTxnId(txid)

                        try {
                            await axios.post(`/api/create`, {
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
                                venue: JSON.stringify(event.venue),
                            })
                        } catch (e) {
                            console.log('create api')
                        }
                        const { data, error } = await supabase
                            .from('events')
                            .insert({
                                contractAddress: eventPDA.toString(),
                                inviteOnly: isInviteOnly,
                                Venue: JSON.stringify(event.venue),
                                IRL: event.category.event_type === 'In-Person',
                            })
                        setIsPublished(true)
                        setInTxn(false)
                        if (isInviteOnly) {
                            uploadFormDetails(formData, child)
                        }
                        setFormData(defaultFormData)
                    } else {
                        throw Error(
                            'signTransaction is undefined, line 205 create/index.tsx'
                        )
                    }
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
            <EventCreatedModal
                isPublished={isPublished}
                event={event}
                child={child}
                eventLink={eventLink}
            />
            <Box
                position="absolute"
                minH="100vh"
                w="full"
                h="full"
                overflow="scroll"
                overflowX="hidden"
            >
                <CreateEventCTA
                    step={step}
                    setStep={setStep}
                    isInviteOnly={isInviteOnly}
                />
                {wallet.address != null ? (
                    <Box mt="6">
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
                                isSolHost={isSolHost}
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
                                onSubmit={(
                                    link: any,
                                    huddle: boolean,
                                    venue: VenueType
                                ) => {
                                    setStep(4)
                                    setEvent({
                                        ...event,
                                        link,
                                        isHuddle: huddle,
                                        venue: venue,
                                    })
                                }}
                            />
                        </Box>
                        {isInviteOnly ? (
                            <>
                                {step === 4 ? (
                                    <Box>
                                        {/* STEP5🔺 */}
                                        <Step5
                                            onSubmit={(data) => {
                                                setFormData({
                                                    ...formData,
                                                    customQues: data,
                                                })

                                                setStep(5)
                                            }}
                                        />
                                    </Box>
                                ) : null}
                                {step === 5 ? (
                                    <Box>
                                        {/* STEP5🔺 */}
                                        <SubmitStep
                                            event={event}
                                            inTxn={inTxn}
                                            onSubmit={
                                                wallet.chain === 'SOL'
                                                    ? onSolanaSubmit
                                                    : onPolygonSubmit
                                            }
                                        />
                                    </Box>
                                ) : null}
                            </>
                        ) : (
                            <Box display={step === 4 ? 'block' : 'none'}>
                                {/* STEP5🔺 */}
                                <SubmitStep
                                    event={event}
                                    inTxn={inTxn}
                                    onSubmit={
                                        wallet.chain === 'SOL'
                                            ? onSolanaSubmit
                                            : onPolygonSubmit
                                    }
                                />
                            </Box>
                        )}
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
