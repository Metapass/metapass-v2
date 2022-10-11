import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { Chain } from '../types/blockchain.types';
import { AnchorProvider } from '@project-serum/anchor';
import { useState, useEffect } from 'react';
import { useWallet, AnchorWallet } from '@solana/wallet-adapter-react';
declare const window: any;
const env: any = process.env.NEXT_PUBLIC_ENV === 'prod';
export function useMultichainProvider(
  chain: Chain,
  address: string,
): [Web3 | ethers.providers.Web3Provider | AnchorProvider | null] {
  const [provider, setProvider] = useState<
    Web3 | ethers.providers.Web3Provider | AnchorProvider | null
  >(null);
  useEffect(() => {
    if (chain === 'POLYGON') {
      if (!window.ethereum) return;
      // const endpoint: any = env
      //     ? process.env.NEXT_PUBLIC_ENDPOINT_POLYGON
      //     : process.env.NEXT_PUBLIC_ENDPOINT_MUMBAI
      // const web3 = new Web3(endpoint as string)
      // web3 && setProvider(web3)
      const prdr = new ethers.providers.Web3Provider(window.ethereum);
      prdr && setProvider(prdr);
    } else if (chain === 'SOL') {
      if (!window.solana) return;
      const wallet = useWallet();
      const anchorProvider = new AnchorProvider(
        new Connection(
          process.env.NEXT_PUBLIC_ENV == 'prod'
            ? (process.env.NEXT_PUBLIC_ALCHEMY_SOLANA as string)
            : (process.env.NEXT_PUBLIC_ALCHEMY_SOLANA as string),
        ),
        wallet as AnchorWallet,
        {
          preflightCommitment: 'recent',
        },
      );
      anchorProvider && setProvider(anchorProvider);
    }
  }, [chain, address]);
  return [provider];
}
