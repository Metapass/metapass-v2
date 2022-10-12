
import { useContext, useEffect, useState } from 'react'
import { Image, Flex, Text, Button, Box, Skeleton } from '@chakra-ui/react'
import { ethers } from 'ethers'
declare const window: any
import abi from '../../utils/Metapass.json'
import { TicketType } from '../../types/Ticket.type'
import GenerateQR from '../../utils/generateQR'

import { supabase } from '../../lib/config/supabaseConfig'
import { web3Context } from '../../utils/web3Context'
import { Web3Auth } from '@web3auth/web3auth'
import { useProvider } from 'wagmi'

export default function TicketLayout({
  image,
  eventType,
  wallet,
  eventLink,
  contractAddress,
  ticket,
}: {
  image: string;
  eventType: string;
  wallet: any;
  eventLink: string;
  contractAddress: string;
  ticket: TicketType;
}) {
    const [qr, setQr] = useState<string>('')
    const [ticketimg, setTicketimg] = useState<string>('')
    const [web3, setWeb3, web3auth, setWeb3auth]: any = useContext(web3Context)
    async function getMeta(contract: any, tokenuri: string) {
        try {
            const metadata = await contract.tokenURI(tokenuri)
            const img = JSON.parse(metadata).image
            if (img) {
                setTicketimg(img)
            }
        } catch (error) {
            console.log('error in getting image ', error)
        }

    }
  }

    const walletProvider = useProvider()

    useEffect(() => {
        if (
            (walletProvider ||
                (web3auth as Web3Auth)?.provider) &&
            contractAddress.startsWith('0x')
        ) {
            const provider = new ethers.providers.JsonRpcProvider(
                process.env.ENV == 'dev'
                    ? process.env.NEXT_PUBLIC_ENDPOINT_MUMBAI
                    : process.env.NEXT_PUBLIC_ENDPOINT_POLYGON
            )

            const contract = new ethers.Contract(
                ethers.utils.getAddress(contractAddress),
                abi.abi,
                provider
            )
            if (ticket) {
                getMeta(contract, ticket.ticketID)
            }
        } else {
            console.log('no wallet provider')
        }
    }, [contractAddress, ticket])

    useEffect(() => {
        const fetchDetails = async () => {
            if (wallet.address && contractAddress) {
                let c = contractAddress.startsWith('0x')
                    ? ethers.utils.getAddress(contractAddress)
                    : contractAddress
                try {
                    const { data, error } = await supabase
                        .from('tickets')
                        .select('uuid')
                        .eq('buyer', wallet.address)
                        .filter('event', 'in', `("${c}")`)
                    console.log(data, 'uuid data')
                    setQr(data?.[0]?.uuid)
                } catch (error) { }
            }
        }
        fetchDetails()
    }, [])

  return (
    <Box
      backgroundColor='white'
      rounded='lg'
      overflow='hidden'
      h='full'
      bg='white'
      _hover={{ transform: 'scale(1.01)' }}
      _active={{ transform: 'scale(1.03)' }}
      transitionDuration='200ms'
      cursor='pointer'
      boxShadow='0px -4px 52px rgba(0, 0, 0, 0.11)'
      // w="full"
      border='1px'
      w='full'
      position='relative'
      borderColor='blackAlpha.200'
      p={{ base: '2', md: '5' }}
    >
      <Flex
        justify='center'
        align='center'
        direction={{ base: 'column', md: 'row' }}
      >
        <Image
          maxW='sm'
          maxH={'sm'}
          borderRadius='md'
          src={ticketimg || image}
          alt='ticket img'
        />
        <Flex flexDir='column' mr={{ md: '6' }}>
          <Text
            fontSize={{ base: 'sm', xl: 'lg' }}
            fontWeight='semibold'
            color='brand.black600'
            textAlign='center'
            p={2}
            noOfLines={2}
          >
            {ticket.event.title}
          </Text>
          {ticket.event.category.event_type == 'Online' ? (
            <Flex justify='flex-end' align='center'>
              <Box
                p='1.5px'
                mx='auto'
                mt='6'
                mb={{ base: '4', md: '0' }}
                transitionDuration='200ms'
                rounded='full'
                w='fit-content'
                boxShadow='0px 5px 33px rgba(0, 0, 0, 0.08)'
                bg='brand.gradient'
                _hover={{ transform: 'scale(1.05)' }}
                _focus={{}}
                _active={{ transform: 'scale(0.95)' }}
              >
                <Button
                  type='submit'
                  rounded='full'
                  bg='white'
                  size='sm'
                  px={5}
                  color='blackAlpha.700'
                  fontWeight='medium'
                  _hover={{}}
                  leftIcon={
                    <Box
                      _groupHover={{
                        transform: 'scale(1.1)',
                      }}
                      transitionDuration='200ms'
                    >
                      <Image
                        src='/assets/elements/event_ticket_gradient.svg'
                        w='4'
                        alt='ticket'
                      />
                    </Box>
                  }
                  _focus={{}}
                  _active={{}}
                  onClick={() => {
                    window.open(eventLink, '_blank');
                  }}
                  role='group'
                >
                  Go to event
                </Button>
              </Box>
            </Flex>
          ) : (
            <Skeleton
              isLoaded={qr !== '' && qr !== undefined}
              borderRadius='xl'
            >
              <Box
                borderRadius='2xl'
                w='fit-content'
                mx='auto'
                border='1px'
                borderColor='blackAlpha.200'
                boxShadow='0px -4px 52px rgba(0, 0, 0, 0.11)'
              >
                <GenerateQR data={qr} />
              </Box>
            </Skeleton>
            // </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
    // </Skeleton>
  );
}
