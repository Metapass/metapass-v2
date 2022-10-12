import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Image,
  Tabs,
  TabList,
  Tab,
  Box,
  TabPanels,
  TabPanel,
  Grid,
  Center,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useState, useContext } from 'react';
import { useAccount } from 'wagmi';
import {
  Event,
  CategoryType,
  DescriptionType,
  ImageType,
} from '../../types/Event.type';
import { TicketType } from '../../types/Ticket.type';
import { decryptLink } from '../../utils/linkResolvers';
import { gqlEndpoint } from '../../utils/subgraphApi';
import { walletContext } from '../../utils/walletContext';
import TicketLayout from './Ticket.layout';

export default function MyEvents({ isOpen, onClose }: any) {
  const [tab, setTab] = useState('upcoming');
  const [wallet] = useContext<any>(walletContext);
  const [store, setStore] = useState<TicketType[]>();
  const [myTickets, setMyTickets] = useState<TicketType[]>([
    {
      id: '',
      ticketID: '',
      buyer: {
        id: '',
      },
      event: {
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
        isHuddle: false,
        isSolana: false,
      },
    },
  ]);
  function UnicodeDecodeB64(str: any) {
    return decodeURIComponent(atob(str));
  }
  const parseMyEvents = (myTickets: Array<any>): TicketType[] => {
    let ticketArray = myTickets.map((ticket: any) => {
      const event: any = ticket.childContract;
      let type = event.type;
      let category: CategoryType = JSON.parse(UnicodeDecodeB64(event.category));
      let image: ImageType = JSON.parse(UnicodeDecodeB64(event.image));
      let desc: DescriptionType = JSON.parse(
        UnicodeDecodeB64(event.description),
      );

      return {
        id: ticket.id,
        ticketID: ticket.ticketID,
        buyer: {
          id: ticket.buyer.id,
        },
        event: {
          id: event.id,
          title: event.title,
          childAddress: event.childAddress,
          category: category,
          image: image,
          eventHost: event.eventHost,
          fee: Number(event.fee) / 10 ** 18,
          date: event.date,
          description: desc,
          seats: event.seats,
          owner: event.eventHost,
          link: event.link,
          type: type,
          tickets_available: event.seats - event.ticketsBought.length,
          tickets_sold: event.ticketsBought.length,
          buyers: event.buyers,
          isHuddle: event.link.includes('huddle01') ? true : false,
          isSolana: !ethers.utils.isAddress(event.childAddress),
        } as Event,
      } as TicketType;
    });
    return ticketArray.reverse();
  };

  const parseMySolEvents = (myTickets: Array<any>): TicketType[] => {
    let ticketArray = myTickets.map((ticket: any) => {
      const event: any = ticket.eventPDA;
      let type = ticket.type;
      let category: CategoryType = JSON.parse(ticket.category);
      let image: ImageType = JSON.parse(ticket.image);
      let desc: DescriptionType = JSON.parse(ticket.description);
      const link = decryptLink(ticket.link);

      return {
        id: ticket.id,
        ticketID: ticket.id,
        buyer: {
          id: ticket.id,
        },
        event: {
          id: ticket.id,
          title: ticket.title,
          childAddress: ticket.eventPDA,
          category: category,
          image: image,
          eventHost: ticket.eventHost,
          fee: Number(ticket.fee) / 10 ** 18,
          date: ticket.date,
          description: desc,
          seats: ticket.seats,
          owner: ticket.eventHost,
          link: link,
          type: type,
          tickets_available: ticket.seats - ticket.buyers.length,
          tickets_sold: ticket.buyers.length,
          buyers: ticket.buyers,
          isHuddle: ticket.link.includes('huddle01') ? true : false,
          isSolana: true,
        } as Event,
      } as TicketType;
    });
    return ticketArray.reverse();
  };

  async function getMyTickets() {
    const myTicketsQuery = {
      operationName: 'fetchMyTickets',
      query: `query fetchMyTickets {
                    ticketBoughtEntities(
                      where: { buyer_contains: "${wallet.address.toLowerCase()}" }
                    ) {
                        id
                        ticketID
                      childContract {
                        id
                        title
                        childAddress
                        category
                        image
                        eventHost
                        fee
                        ticketsBought{
                            id
                        }
                        seats
                        link
                        description
                        date
                      }
                      buyer {
                        id
                      }
                    }
                  }`,
    };
    try {
      const res = await axios({
        method: 'POST',
        url: gqlEndpoint,
        data: myTicketsQuery,
        headers: {
          'content-type': 'application/json',
        },
      });
      if (!!res.data?.errors?.length) {
        throw new Error('Error fetching featured events');
      }
      return res.data;
    } catch (error) {}
  }

  const getSolEvents = async () => {
    const { data } = await axios.get(`/api/getTickets`, {
      params: {
        address: wallet?.address,
      },
    });
    return data;
  };

  useEffect(() => {
    if (wallet.address && wallet.address.startsWith('0x')) {
      if (wallet?.address) {
        getMyTickets()
          .then((res) => {
            const data: TicketType[] = parseMyEvents(
              res.data.ticketBoughtEntities,
            );
            setStore(data);
            setMyTickets(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      if (wallet.address) {
        getSolEvents().then((res: any) => {
          const data: TicketType[] = parseMySolEvents(res);
          setStore(data);
          setMyTickets(data);
        });
      }
    }
  }, [wallet.address]);

  return (
    isOpen && (
      <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded='2xl'>
          <ModalBody>
            <Flex
              justify='center'
              w='full'
              textAlign='center'
              mt='8'
              mb='8'
              direction='column'
            >
              <Flex justify='center' mb='4'>
                <Text
                  fontWeight='medium'
                  color='brand.black'
                  fontSize='xl'
                  position='relative'
                >
                  My Events
                </Text>
                <Image
                  w='4'
                  mt='-8'
                  src='/assets/elements/sparkle_dark.svg'
                  alt='element'
                />
              </Flex>
              <Flex w='full' justify='center'>
                <Tabs mt='4' align='start' w='fit-content' variant='unstyled'>
                  <TabList
                    px='2'
                    bg='white'
                    mx='auto'
                    w='fit-content'
                    boxShadow='0px 13px 101px rgba(0, 0, 0, 0.08)'
                    rounded='full'
                    border='1px'
                    borderColor='blackAlpha.100'
                  >
                    <Tab
                      pb='0'
                      display='flex'
                      flexDirection='column'
                      _focus={{}}
                      onFocus={() => {
                        setTab('upcoming');
                        if (store) {
                          let filter = store.filter((tix: any) => {
                            const date = tix.event.date;
                            let parsedDate = date.split('T')[0];
                            let time = date.split('T')[1].split('-')[0];
                            return (
                              new Date(parsedDate + ' ' + time) > new Date()
                            );
                          });
                          setMyTickets(filter);
                        }
                      }}
                      _hover={{
                        color: tab !== 'upcoming' && 'blackAlpha.600',
                      }}
                      _active={{}}
                      fontWeight={tab === 'upcoming' ? 'medium' : 'normal'}
                      color={
                        tab === 'upcoming' ? 'brand.black600' : 'blackAlpha.500'
                      }
                    >
                      <Text mb='2'>Upcoming Events</Text>
                      {tab === 'upcoming' && (
                        <Box w='full' h='1' bg='brand.gradient' />
                      )}
                    </Tab>
                    <Tab
                      pb='0'
                      display='flex'
                      flexDirection='column'
                      _focus={{}}
                      _active={{}}
                      onFocus={() => {
                        setTab('past');
                        if (store) {
                          let filter = store.filter((tix: any) => {
                            const date = tix.event.date;
                            let parsedDate = date.split('T')[0];
                            let time = date.split('T')[1].split('-')[0];
                            return (
                              new Date(parsedDate + ' ' + time) < new Date()
                            );
                          });
                          setMyTickets(filter);
                        }
                      }}
                      fontWeight={tab === 'past' ? 'medium' : 'normal'}
                      _hover={{
                        color: tab !== 'past' && 'blackAlpha.600',
                      }}
                      color={
                        tab === 'past' ? 'brand.black600' : 'blackAlpha.500'
                      }
                    >
                      <Text mb='2'>Past Events</Text>
                      {tab === 'past' && (
                        <Box w='full' h='1' bg='brand.gradient' />
                      )}
                    </Tab>
                  </TabList>
                  <TabPanels mt='10'>
                    <TabPanel>
                      <Grid
                        templateColumns={{
                          md: 'repeat(1, 1fr)',
                          lg: 'repeat(1, 1fr)',
                          xl: 'repeat(1, 1fr)',
                        }}
                        px={{ base: '6', md: '10' }}
                        gap={6}
                      >
                        {myTickets.length > 0 ? (
                          myTickets.map((data, key) => (
                            <Box key={key}>
                              <TicketLayout
                                image={
                                  data.event.image.gallery[
                                    data.event.image.gallery.length - 1
                                  ]
                                }
                                wallet={wallet}
                                ticket={data}
                                contractAddress={data.event.childAddress}
                                eventLink={data.event.link as string}
                                eventType={data.event.category.event_type}
                              />
                            </Box>
                          ))
                        ) : (
                          <Box maxW={{ xl: '390px' }} minW={{ xl: '390px' }}>
                            <Heading
                              textAlign='center'
                              fontWeight='semibold'
                              fontFamily='subheading'
                              color='gray.300'
                              fontSize={{
                                md: '23.2px',
                                lg: '23.2px',
                                xl: '28',
                              }}
                            >
                              No events here :(
                            </Heading>
                          </Box>
                        )}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <Grid
                        templateColumns={{
                          md: 'repeat(1, 1fr)',
                          lg: 'repeat(1, 1fr)',
                          xl: 'repeat(1, 1fr)',
                        }}
                        px={{ base: '6', md: '10' }}
                        gap={6}
                      >
                        {myTickets.length > 0 ? (
                          myTickets.map((data, key) => (
                            <Box w='full' key={key}>
                              <TicketLayout
                                image={data.event.image.image}
                                wallet={wallet}
                                ticket={data}
                                contractAddress={data.event.childAddress}
                                eventLink={data.event.link as string}
                                eventType={data.event.category.event_type}
                              />
                            </Box>
                          ))
                        ) : (
                          <Box
                            maxW={{ xl: '390px' }}
                            minW={{ xl: '390px' }}
                            ml='300px'
                          >
                            <Heading
                              textAlign='center'
                              fontWeight='semibold'
                              fontFamily='subheading'
                              color='gray.300'
                              fontSize={{
                                md: '23.2px',
                                lg: '23.2px',
                                xl: '28',
                              }}
                            >
                              No events here :(
                            </Heading>
                          </Box>
                        )}
                      </Grid>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  );
}
