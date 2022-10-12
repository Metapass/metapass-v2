import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import React from 'react';
import ChatwootWidget from '../Elements/Chatwoot.component';
import theme from '../../styles/theme.chakra';

function Chakra({ Component, pageProps }: any) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <ChatwootWidget />
        <NextNProgress color='#6451FB' />

        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default Chakra;
