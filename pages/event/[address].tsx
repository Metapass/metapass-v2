import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import type { GetServerSideProps, NextPage } from 'next';
import {
  CategoryType,
  DescriptionType,
  Event,
  ImageType,
} from '../../types/Event.type';
import { useEffect, useState } from 'react';
import NavigationBar from '../../components/Navigation/NavigationBar.component';
import { Skeleton } from '@chakra-ui/react';
import axios from 'axios';
import { gqlEndpoint } from '../../utils/subgraphApi';
import { ethers } from 'ethers';
import { supabase } from '../../lib/config/supabaseConfig';
import { useRouter } from 'next/router';
import og from '../../OG.json';
import Head from 'next/head';
import dynamic from 'next/dynamic';
const EventLayout = dynamic(() => import('../../layouts/Event/Event.layout'));
declare const window: any;
const Event: NextPage = ({ event, og }: any) => {
  const [featEvent, setFeatEvent] = useState<Event>(event);
  const [isInviteOnly, setInviteOnly] = useState<boolean>(false);
  const router = useRouter();
  const { address } = router.query;
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('events')
        .select('inviteOnly')
        .eq('contractAddress', address);

      data?.length !== 0 && setInviteOnly(data?.[0].inviteOnly);
    }

    fetchData();
  }, [address]);

  return (
    <Box minH='100vh' h='full' overflow='hidden' bg='blackAlpha.50'>
      <Head>
        {' '}
        <title>{event.title}</title>
        <meta name='twitter:image' content={og.img} />
        <meta name='og:description' content={og.desc} />
        <meta property='og:image' itemProp='image' content={og.img} />
        <meta
          property='og:title'
          content={`Apply for ${event.title} on Metapass!`}
        />
        <meta property='og:site_name' content={'https://app.metapasshq.xyz/'} />
        <meta
          name='twitter:title'
          content={`Apply for ${event.title} on Metapass!`}
        />
        <meta name='twitter:description' content={og.desc} />
        <meta name='twitter:card' content='summary_large_image'></meta>
      </Head>
      <NavigationBar
        isOpen3={isOpen3}
        onOpen3={onOpen3}
        onClose3={onClose3}
        mode='white'
      />
      <Box p='4' />
      <Flex
        justify='center'
        mx='auto'
        mt='16'
        px='6'
        w='full'
        maxW='1400px'
        experimental_spaceX='10'
      >
        <Box maxW='1000px' w='full'>
          {featEvent ? (
            <Skeleton isLoaded={featEvent.id !== ''}>
              <EventLayout
                isOpen3={isOpen3}
                onOpen3={onOpen3}
                onClose3={onClose3}
                event={featEvent}
                isInviteOnly={isInviteOnly}
              />
            </Skeleton>
          ) : (
            <Flex alignItems={'center'}>Event Doesn&apos;t Exist</Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Event;

export async function getServerSideProps({ query }: any) {
  const address = query.address;
  let parsedEvent;

  async function getFeaturedEvents() {
    const featuredQuery = {
      operationName: 'fetchFeaturedEvents',
      query: `query fetchFeaturedEvents {
                childCreatedEntities(where:{id:"${String(
                  address,
                ).toLowerCase()}"}) {
                    id
                    title
                    childAddress
                    category
                    ticketsBought{
                        id
                    }
                    link
                    description
                    date
                    fee
                    venue
                    image
                    eventHost
                    seats
                    buyers{
                        id
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
    } catch (error) {
      console.log('error', error);
    }
  }
  function UnicodeDecodeB64(str: any): any {
    if (str !== 'undefined') {
      try {
        return decodeURIComponent(Buffer.from(str, 'base64').toString());
      } catch (error) {
        return decodeURIComponent(Buffer.from(str, 'utf-8').toString());
      }
    } else {
      return null;
    }
  }
  const parseFeaturedEvents = (event: any) => {
    if (event) {
      let type: string = JSON.parse(
        UnicodeDecodeB64(event.category),
      ).event_type;
      let category: CategoryType = JSON.parse(UnicodeDecodeB64(event.category));
      let image: ImageType = JSON.parse(UnicodeDecodeB64(event.image));
      let desc: DescriptionType = JSON.parse(
        UnicodeDecodeB64(event.description),
      );
      let venue = null;

      try {
        venue = JSON.parse(UnicodeDecodeB64(event?.venue!));
      } catch (e) {
        venue = UnicodeDecodeB64(event.venue);
      }

      return {
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
        venue: venue,
        tickets_available: event.seats - event.ticketsBought?.length,
        tickets_sold: event.ticketsBought?.length,
        buyers: event.buyers,
        slides: image.gallery,
        isSolana: false,
        isHuddle: event.link.includes('huddle01'),
      } as Event;
    } else {
      return null;
    }
  };
  const getSolanaEvents = async () => {
    const event = await axios.get(
      `${process.env.NEXT_PUBLIC_MONGO_API}/getEvent/${address}`,
    );
    if (event.data) {
      const data = event.data;
      let venue;
      try {
        venue = JSON.parse(data.venue);
      } catch (e) {
        venue = null;
      }
      return {
        ...data,
        venue: venue,
        owner: data.eventHost,
        childAddress: address as string,
        category: JSON.parse(data.category),
        image: JSON.parse(data.image),
        description: JSON.parse(data.description),
        isSolana: true,
      };
    } else {
      return null;
    }
  };

  if (address) {
    const isEtherAddress = ethers.utils.isAddress(address);

    if (isEtherAddress) {
      const event = await getFeaturedEvents();
      parsedEvent = parseFeaturedEvents(event.data.childCreatedEntities[0]);
    } else {
      parsedEvent = await getSolanaEvents();
    }
  }
  let img = (og as any)[parsedEvent.childAddress || address];

  return {
    props: {
      event: parsedEvent,
      og: img
        ? img
        : {
            desc: `Apply for ${parsedEvent.title} on Metapass now!`,
            img: `http://mp-og.vercel.app/${parsedEvent.title}`,
          },
    },
  };
}
