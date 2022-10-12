import { useForceUpdate } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import resolveDomains from '../../hooks/useDomain';
import resolveBalance from '../../hooks/useSolBalance';

import { WalletType } from '../../utils/walletContext';

export const ConnectWallet = ({
  children,
  redirectToWelcome,
  noToast,
  setWallet,
  setAddress,
  setBalance,
  setWalletType,
  onClose,
  isOpen,
}: {
  children: React.ReactNode;
  noFullSize?: boolean;
  redirectToWelcome?: boolean;
  noToast?: boolean;
  setWallet: Dispatch<SetStateAction<WalletType>>;
  setAddress: any;
  setBalance: any;
  setWalletType: any;
  onClose: () => void;
  isOpen: boolean;
  onOpen: () => void;
}) => {
  const { wallet: SolanaWallet, connect, publicKey } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [clicked, setClicked] = useState(false);
  const [fire, setFire] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchValues() {
      const req =
        !publicKey &&
        SolanaWallet &&
        SolanaWallet.readyState === 'Installed' &&
        clicked;
      // console.log('tees', !publicKey, clicked)

      if (req) {
        try {
          connect();
        } catch (e) {
          console.log(e);
        }
        return 0;
      }
      if (publicKey) {
        onClose();
        const b = await resolveBalance(publicKey?.toBase58());
        if (!noToast)
          toast.success('Connected to Solana wallet', {
            id: 'connect-sol-wal',
          });
        if (redirectToWelcome) router.push(`/welcome/${publicKey}`);

        if (setAddress) setAddress(publicKey.toString());

        if (setBalance) setBalance(b?.toString());

        if (setWallet)
          setWallet({
            address: publicKey.toString(),
            balance: b?.toString()!,
            type: 'sol',
            domain: null,
            chain: 'SOL',
          });

        if (setWalletType) setWalletType('sol');
      }
    }
    fetchValues();
  }, [
    SolanaWallet,
    visible,
    publicKey,
    redirectToWelcome,
    clicked,
    fire,
    connect,
  ]);

  const handleConnect = () => {
    setClicked(true);
    if (SolanaWallet) return;
    console.log('Solana Wallet retrieved', SolanaWallet);
    setVisible(true);
  };

  return <div onClick={handleConnect}>{children}</div>;
};
