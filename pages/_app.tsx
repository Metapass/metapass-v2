import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./../styles/theme.chakra";
import Head from "next/head";
import PageLayout from "../components/Wrappers/PageLayout.component";
import Wallet from "../utils/walletContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MetaPass | Reimagining Events</title>
        <script
          async
          src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.1/dist/umd/index.min.js"
        ></script>
        <script
          async
          src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"
        ></script>
      </Head>
      <Wallet>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Wallet>
    </>
  );
}

export default MyApp;
