import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import type { NextPage } from 'next/types';

import { useEffect, useState } from 'react';
import NavigationBar from '../../components/Navigation/NavigationBar.component';
import { Skeleton } from '@chakra-ui/skeleton';

import { supabase } from '../../lib/config/supabaseConfig';
import { useRouter } from 'next/router';
// import ogdata from '../../OG.json';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Event } from '../../types/Event.type';
const EventLayout = dynamic(() => import('../../layouts/Event/Event.layout'));
// declare const window: any;
const Event: NextPage = () => {
  const [featEvent, setFeatEvent] = useState<Event | null>({
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
  });
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
      const resp = await axios.get(
        `https://web-staging-0e5d.up.railway.app/api/getEventByAddress/${address}`,
      );
      setFeatEvent(resp.data);
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
      {featEvent && (
        <Head>
          {' '}
          <title>{`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/title`}</title>
          <meta
            name='twitter:image'
            content={`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/img`}
          />
          <meta
            name='og:description'
            content={`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/desc`}
          />
          <meta
            property='og:image'
            itemProp='image'
            content={`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/img`}
          />
          <meta
            property='og:title'
            content={`Apply for ${featEvent.title} on Metapass!`}
          />
          <meta
            property='og:site_name'
            content={'https://app.metapasshq.xyz/'}
          />
          <meta
            name='twitter:title'
            content={`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/content`}
          />
          <meta
            name='twitter:description'
            content={`https://web-staging-0e5d.up.railway.app/api/getOgByEvent/${address}/desc`}
          />
          <meta name='twitter:card' content='summary_large_image'></meta>
        </Head>
      )}
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
            <Skeleton isLoaded={featEvent.id != ''}>
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
