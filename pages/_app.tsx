import '../styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { AppProps } from 'next/app';
import Wallet from '../utils/walletContext';
import Web3Wrapper from '../utils/web3Context';
import { Toaster } from 'react-hot-toast';
import Contract from '../utils/contractContext';
import Script from 'next/script';
import { ContextProvider } from '../contexts/ContextProvider';
import { configureChains, chain, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RecoilRoot } from 'recoil';
import dynamic from 'next/dynamic';

import NextNProgress from 'nextjs-progressbar';
const Chakra = dynamic(() => import('../components/Root/Chakra.root'));
const Chatwoot = dynamic(
  () => import('../components/Elements/Chatwoot.component'),
);
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai],
  [publicProvider()],
);

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
});
declare const window: any;
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        async
        defer
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        src='https://analytics.metapasshq.xyz/umami.js'
      />
      <RecoilRoot>
        <Wallet>
          <WagmiConfig client={client}>
            <Web3Wrapper>
              <ContextProvider>
                <Contract>
                  <Toaster />
                  <Chakra Component={Component} pageProps={pageProps}>
                    {' '}
                    {<Chatwoot />}
                    <NextNProgress color='#6451FB' />
                  </Chakra>
                </Contract>
              </ContextProvider>
            </Web3Wrapper>
          </WagmiConfig>
        </Wallet>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
