import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./../styles/theme.chakra";
import Head from "next/head";
import PageLayout from "../components/Wrappers/PageLayout.component";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MetaPass | Reimagining Events</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
