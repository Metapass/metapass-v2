import { useWallet } from '@solana/wallet-adapter-react';
import { Web3Auth } from '@web3auth/web3auth';
import { useContext } from 'react';

// import { useEffect, useState, useCallback } from 'react'
import { useDisconnect } from 'wagmi';
import { Chain } from '../types/blockchain.types';
import { web3Context } from '../utils/web3Context';

const useMultichainDisconnect = (
  chain: Chain | null,
  type?: 'mm' | 'wc' | 'sol' | 'web3auth' | null,
) => {
  let { disconnect: evmDisconnect } = useDisconnect();
  let { disconnect: solDisconnect } = useWallet();
  const [web3, setWeb3, web3auth, setWeb3auth] = useContext(web3Context);
  let disconnector = null;
  const multichainDisconnector = async () => {
    if (type === 'web3auth') {
      await (web3auth as Web3Auth).logout();
      console.log('web3auth logged out');
    } else if (chain) {
      if (chain === 'POLYGON') {
        evmDisconnect();
        console.log('evm logged out');
      }
      if (chain === 'SOL') {
        await solDisconnect();
        console.log('sol logged out');
      }
    } else {
      disconnector = null;
    }
  };

  return { multichainDisconnector };
};
export default useMultichainDisconnect;
