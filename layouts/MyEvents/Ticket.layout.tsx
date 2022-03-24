import { walletContext } from '../../utils/walletContext'
import { useContext, useEffect, useState } from 'react'
import { Image, Flex, Text, Button, Box, Skeleton } from '@chakra-ui/react'
import { ethers } from 'ethers'
declare const window: any
import abi from '../../utils/Metapass.json'
import { TicketType } from '../../types/Ticket.type'
import GenerateQR from '../../utils/generateQR'
import { db, doc, getDoc } from '../../utils/firebaseUtils'
import { DocumentData } from 'firebase/firestore'
declare let contract: any
export default function TicketLayout({
    image,
    eventType,
    wallet,
    eventLink,
    contractAddress,
    ticket,
}: {
    image: string
    eventType: string
    wallet: any
    eventLink: string
    contractAddress: string
    ticket: TicketType
}) {
    const [qr, setQr] = useState<string>('')
    const [ticketimg, setTicketimg] = useState<string>('')
    useEffect(() => {
        // console.log(contractAddress)
        async function getMeta(contract: any, tokenuri: string) {
            // console.log(tokenuri)
            const metadata = await contract.tokenURI(tokenuri)
            const img = JSON.parse(metadata).image
            if (img) {
                setTicketimg(img)
                console.log(
                    `Successfully set Ticketimg: ${img} for tokenuri: ${tokenuri}`
                )
            } else {
                console.log(`Failed to set Ticketimg for tokenuri: ${tokenuri}`)
            }
        }
        if ((window.ethereum || window.w3.currentProvider) && contractAddress) {
            const provider = new ethers.providers.Web3Provider(
                window.ethereum || window.w3.currentProvider
            )
            const signer = provider.getSigner()

            const contract = new ethers.Contract(
                contractAddress,
                abi.abi,
                provider || signer
            )

            // console.log("here",)
            //         console.log(ticketsBought)
            //        const ticket:{ticketID:string} = ticketsBought.find((ticket:any) => ticket.buyer.id === String(wallet.address).toLowerCase() && ticket.childContract.id === contractAddress.toLowerCase()) as any
            //        ticketsBought.map((ticket:any) => {
            //         console.log(ticket.childContract.id)
            //         console.log(contractAddress.toLowerCase(),ticket.ticketID)
            //    })
            if (ticket) {
                getMeta(contract, ticket.ticketID)
            }
        } else {
            console.log(
                'window.ethereum or window.w3 or contractAddress is undefined:',
                window.ethereum,
                window.w3.currentProvider,
                contractAddress
            )
        }
    }, [contractAddress, ticket])

    useEffect(() => {
        const fetchDetails = async () => {
            if (wallet.address && contractAddress) {
                try {
                    const docRef = doc(db, 'events', contractAddress || 'none')
                    const docSnap = await getDoc(docRef)
                    const data: DocumentData = docSnap.data() as DocumentData
                    for (const [key, value] of Object.entries(data)) {
                        const tickets: [
                            {
                                ticketID: string
                                uuid: string
                                user_address: string
                                timestamp: string
                            }
                        ] = data[key]
                        // console.log(tickets, 'tickets')
                        // console.log(ticket, 'key')
                        // console.log(
                        //     tickets.find((tick) =>
                        //         // console.log(tick.user_address, wallet.address)
                        //         console.log(tick?.ticketID, ticket?.ticketID)
                        //     ),
                        //     'key'
                        // )
                        const qrdata = tickets.find(
                            (tick) =>
                                tick?.user_address?.toLowerCase() ===
                                    String(wallet.address)?.toLowerCase() &&
                                tick?.ticketID ==
                                    (Number(ticket?.ticketID) + 1)?.toString()
                        )?.uuid as string
                        if (qrdata) {
                            setQr(qrdata)
                            console.log(
                                'Successfully fetched and assigned QR: ',
                                qrdata,
                                'for ticket Number: ',
                                Number(ticket?.ticketID) + 1,
                                ' and title: ',
                                ticket.event.title
                            )
                        }

                        // console.log(qr, 'qr inside fetch')
                    }
                } catch (error) {
                    console.log(error, ' Failed to get QR code UUID')
                }
            }
        }
        fetchDetails()
    }, [contractAddress, wallet.address, ticket])

    return (
        // <Skeleton isLoaded={ticketimg && ticket.event.title ? true : false}>
        <Box
            backgroundColor="white"
            rounded="lg"
            overflow="hidden"
            h="full"
            bg="white"
            _hover={{ transform: 'scale(1.01)' }}
            _active={{ transform: 'scale(1.03)' }}
            transitionDuration="200ms"
            cursor="pointer"
            boxShadow="0px -4px 52px rgba(0, 0, 0, 0.11)"
            // w="full"
            border="1px"
            w="full"
            position="relative"
            borderColor="blackAlpha.200"
            p={{ base: '2', md: '5' }}
        >
            <Flex
                justify="center"
                align="center"
                direction={{ base: 'column', md: 'row' }}
            >
                <Image
                    w="sm"
                    borderRadius="md"
                    src={ticketimg}
                    alt="ticket img"
                />
                <Flex flexDir="column" mr={{ md: '6' }}>
                    <Text
                        fontSize={{ base: 'sm', xl: 'lg' }}
                        fontWeight="semibold"
                        color="brand.black600"
                        textAlign="center"
                        p={2}
                        noOfLines={2}
                        isTruncated
                    >
                        {ticket.event.title}
                    </Text>
                    {ticket.event.category.event_type == 'Online' ? (
                        <Flex justify="flex-end" align="center">
                            <Box
                                p="1.5px"
                                mx="auto"
                                mt="6"
                                mb={{ base: '4', md: '0' }}
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
                                    px={5}
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
                                    Go to event
                                </Button>
                            </Box>
                        </Flex>
                    ) : (
                        <Skeleton
                            isLoaded={qr !== '' && qr !== undefined}
                            borderRadius="xl"
                        >
                            <Box
                                borderRadius="2xl"
                                w="fit-content"
                                mx="auto"
                                border="1px"
                                borderColor="blackAlpha.200"
                                boxShadow="0px -4px 52px rgba(0, 0, 0, 0.11)"
                            >
                                <GenerateQR data={qr} />
                            </Box>
                            {/* <Box
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
                            > */}

                            {/* </Flex> */}
                            {/* <Button
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
                                    // window.open(eventLink, '_blank')
                                }}
                                role="group"
                            >
                                Get QR Code
                            </Button> */}
                            {/* </Box> */}
                        </Skeleton>
                        // </Flex>
                    )}
                </Flex>
            </Flex>
        </Box>
        // </Skeleton>
    )
}
