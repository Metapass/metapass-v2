import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Skeleton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  InputGroup,
  Input,
  Heading,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import EventCard from '../../components/Card/EventCard.component';
import {
  CategoryType,
  DescriptionType,
  Event,
  ImageType,
} from '../../types/Event.type';
import sendToAirtable from '../../utils/sendToAirtable';
import ScrollContainer from 'react-indiana-drag-scroll';
import { gqlEndpoint } from '../../utils/subgraphApi';
import axios from 'axios';
import { AiOutlineSend } from 'react-icons/ai';
import EventsLoading from '../../components/Misc/EventsLoading.component';

export default function FeaturedEvents() {
  const [email, setEmail] = useState<string>('');
  const [featEvents, setFeatEvents] = useState<Event[]>([
    {
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
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  async function getPolygonFeaturedEvents() {
    const featuredQuery = {
      operationName: 'fetchFeaturedEvents',
      query: `query fetchFeaturedEvents {
              featuredEntities{
                id
                count
                event{
                    id
                    title
                    childAddress
                    category
                    link
                    ticketsBought{
                        id
                    }
                    image
                    buyers{
                        id
                        
                    }
                    eventHost
                    fee
                    seats
                    description
                    date
                    }
                }
              
        }`,
    };
    try {
      const res = await axios({
        method: 'POST',
        url: gqlEndpoint,
        data: featuredQuery,
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
  function UnicodeDecodeB64(str: any) {
    return decodeURIComponent(atob(str));
  }
  const parseFeaturedEvents = (featuredEvents: Array<any>): Event[] => {
    return featuredEvents.map((event: { event: any }) => {
      let type = JSON.parse(UnicodeDecodeB64(event.event.category)).event_type;
      let category: CategoryType = JSON.parse(
        UnicodeDecodeB64(event.event.category),
      );
      let image: ImageType = JSON.parse(UnicodeDecodeB64(event.event.image));
      let desc: DescriptionType = JSON.parse(
        UnicodeDecodeB64(event.event.description),
      );
      // console.log(event.event.seats, event.event.buyers.length)
      return {
        id: event.event.id,
        title: event.event.title,
        childAddress: event.event.childAddress,
        category: category,
        image: image,
        eventHost: event.event.eventHost,
        fee: Number(event.event.fee) / 10 ** 18,
        date: event.event.date,
        description: desc,
        seats: event.event.seats,
        owner: event.event.eventHost,
        link: event.event.link,
        type: type,
        tickets_available: event.event.seats - event.event.ticketsBought.length,
        tickets_sold: event.event.ticketsBought.length,
        buyers: event.event.buyers,
        isHuddle: event.event.link.includes('huddle01'),
        isSolana: false,
      } as Event;
    });
  };
  const getSolanaFetauredEvents = async (): Promise<Event[]> => {
    let data: Event[] = [];
    const { data: event } = await axios.get(
      'https://web-metapass-backend-pr-4.up.railway.app/api/featuredEvents',
    );

    let events = event;
    console.log(events, 'events');
    events.forEach((event: any) => {
      data.push({
        ...event,
        category: JSON.parse(event.category),
        image: JSON.parse(event.image),
        description: JSON.parse(event.description),
        owner: event.eventHost,
        childAddress: event.eventPDA,
        isSolana: true,
      });
    });
    return data;
  };
  const getFeaturedEvents = async () => {
    let allEvents: Event[] = [];
    const polygonEvents = await getPolygonFeaturedEvents();
    const polygonData: Event[] = parseFeaturedEvents(
      polygonEvents.data.featuredEntities,
    );
    const solanaEvents: Event[] = await getSolanaFetauredEvents();
    allEvents = [...polygonData, ...solanaEvents].sort((a, b) => {
      return (
        new Date(b.date.split('T')[0].split(':').join('/')).getTime() -
        new Date(a.date.split('T')[0].split(':').join('/')).getTime()
      );
    });
    setFeatEvents(allEvents);
  };
  useEffect(() => {
    getFeaturedEvents();
  }, []);

  return (
    <Flex w='full' justify='center' mb={{ md: '-48' }}>
      <Box w='full' pb='20'>
        <Flex maxW='1200px' mx={{ base: '6', md: '12', xl: '40' }}>
          <Text
            fontWeight='medium'
            color='brand.black'
            fontSize={{ base: 'xl', md: '3xl', xl: '4xl' }}
            position='relative'
          >
            Featured Events
          </Text>
          <Image
            w={{ base: '3', md: '5', xl: '6' }}
            mt={{ base: '-5', md: '-8' }}
            src='/assets/elements/sparkle_dark.svg'
            alt='element'
          />
        </Flex>
        <Flex
          _active={{ cursor: 'pointer' }}
          my='8'
          display={{ base: 'none', md: 'flex' }}
        >
          <ScrollContainer
            style={{
              paddingTop: '100px',
              paddingBottom: '100px',
              overflow: 'scroll',
              transform: 'translateY(-100px)',
            }}
          >
            <Flex
              experimental_spaceX='8'
              mx={{ base: '10', xl: '20' }}
              flexWrap='wrap'
            >
              {featEvents.length > 1
                ? featEvents.map((data, key) => (
                    <Box
                      my='5px'
                      maxW={{
                        base: '330px',
                        xl: '390px',
                      }}
                      key={key}
                      h='full'
                      flex='1'
                      marginLeft='30px'
                      minW={{
                        base: '330px',
                        xl: '390px',
                      }}
                    >
                      <EventCard event={data} />
                    </Box>
                  ))
                : [1, 2, 3, 4, 5, 6].map((data, key) => (
                    <EventsLoading key={key} />
                  ))}

              <Box p='10' />
            </Flex>
          </ScrollContainer>
        </Flex>
        <Flex
          display={{ base: 'flex', md: 'none' }}
          direction='column'
          w='full'
          align='center'
          experimental_spaceY='4'
          mt='4'
        >
          {featEvents.length > 1
            ? featEvents.map((data, key) => (
                <Skeleton
                  key={key}
                  maxW={{ base: '330px', xl: '390px' }}
                  minW={{ base: '330px', xl: '390px' }}
                  isLoaded={data !== undefined && data !== null}
                >
                  <EventCard key={key} event={data} />
                </Skeleton>
              ))
            : [1, 2, 3, 4, 5, 6].map((data, key) => (
                <EventsLoading key={key} />
              ))}
        </Flex>
      </Box>
    </Flex>
  );
}

export const EmailBar = ({ email, setEmail, onClose }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Flex
      boxShadow='0px 18px 91px rgba(0, 0, 0, 0.07)'
      bg='white'
      rounded='full'
      alignItems='center'
      mt='6'
      pl='6'
      fontSize='lg'
      w='85%'
      justify='space-between'
    >
      <Flex w='full' alignItems='center'>
        <InputGroup>
          <Input
            bg='transparent'
            border='none'
            _focus={{}}
            _hover={{}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rounded='none'
            placeholder='gm@metapasshq.xyz'
          />
        </InputGroup>
      </Flex>
      <Button
        role='group'
        leftIcon={
          <Flex
            justify='center'
            alignItems='center'
            _groupHover={{ transform: 'scale(1.1)' }}
            transitionDuration='200ms'
          >
            {' '}
            <AiOutlineSend
              size='22px'
              style={{
                rotate: '-45deg',
              }}
            />
          </Flex>
        }
        _hover={{}}
        _focus={{}}
        _active={{}}
        rounded='full'
        color='white'
        bg='brand.gradient'
        roundedBottomLeft='none'
        py='8'
        px='8'
        fontSize='lg'
        isLoading={isSubmitting}
        // loadingText='Submitting'
        onClick={() => {
          // setIsSubmitting(true)
          sendToAirtable(email, setIsSubmitting, onClose);
        }}
      >
        Join
      </Button>
    </Flex>
  );
};
