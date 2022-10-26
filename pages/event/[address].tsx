import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import type {
  // GetServerSidePropsContext,
  GetStaticPropsContext,
  NextPage,
} from 'next/types';

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
const defaultEvent: Event = {
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
};
const Event: NextPage = ({ ogdata }: any) => {
  const [featEvent, setFeatEvent] = useState<Event>(defaultEvent);
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
        `${process.env.NEXT_PUBLIC_MONGO_API}/getEventByAddress/${address}`,
      );
      setFeatEvent(resp.data);
      const { data, error } = await supabase
        .from('events')
        .select('inviteOnly')
        .eq('contractAddress', resp.data.childAddress);
      // console.log(data, 'data', resp.data);
      data?.length !== 0 && setInviteOnly(data?.[0].inviteOnly);
    }

    fetchData();
  }, [address]);
  // console.log(address, 'address');
  return (
    <Box minH='100vh' h='full' overflow='hidden' bg='blackAlpha.50'>
      {
        <Head>
          {' '}
          <title>{ogdata.title}</title>
          <meta name='twitter:image' content={ogdata.img} />
          <meta name='og:description' content={ogdata.desc} />
          <meta property='og:image' itemProp='image' content={ogdata.img} />
          <meta
            property='og:title'
            content={`Get your ticket to ${ogdata.title}`}
          />
          <meta
            property='og:site_name'
            content={'https://app.metapasshq.xyz/'}
          />
          <meta
            name='twitter:title'
            content={`Get your ticket to ${ogdata.title}`}
          />
          <meta name='twitter:description' content={ogdata.desc} />
          <meta name='twitter:card' content='summary_large_image'></meta>
        </Head>
      }
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
          {featEvent !== undefined ? (
            <Skeleton isLoaded={!!featEvent?.id}>
              <EventLayout
                isOpen3={isOpen3}
                onOpen3={onOpen3}
                onClose3={onClose3}
                event={featEvent}
                isInviteOnly={isInviteOnly}
              />
            </Skeleton>
          ) : (
            <Flex alignItems={'center'}>
              Event Doesn&apos;t Exist{console.log(featEvent, 'featEvent')}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

// export async function getServerSideProps({
//   query,
//   res,
// }: GetServerSidePropsContext) {
//   const { address } = query;
//   const { data } = await axios.get(
//     `${process.env.NEXT_PUBLIC_MONGO_API}/getOgByEvent/${address}`,
//   );
//   res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30');
//   return {
//     props: { ogdata: data },
//   };
// }
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params?.address) throw new Error('No address provided');
  const { data: ogdata } = await axios.get(
    `${process.env.NEXT_PUBLIC_MONGO_API}/getOpenGraph/${params.address}`,
  );

  return {
    props: {
      ogdata,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 600, // In seconds
  };
}
export async function getStaticPaths() {
  const { data: eventAdresses } = await axios.get(
    `${process.env.NEXT_PUBLIC_MONGO_API}/getEveryEventsAddress`,
  );

  // Get the paths we want to pre-render based on posts
  const paths = eventAdresses.map((address: string) => ({
    params: { address: address },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' };
}

export default Event;
