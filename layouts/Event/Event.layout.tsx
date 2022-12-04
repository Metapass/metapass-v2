import {
  AspectRatio,
  Box,
  Flex,
  Text,
  Link as ChakraLink,
  Image,
  Button,
  Divider,
  AvatarGroup,
  Modal,
  ModalBody,
  ModalContent,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Input,
  ModalOverlay,
  useClipboard,
  IconButton,
  Fade,
  useDisclosure,
  Img,
} from '@chakra-ui/react';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useState, useContext, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Event } from '../../types/Event.type';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import moment from 'moment';
import { motion } from 'framer-motion';
import { walletContext } from '../../utils/walletContext';
import { ethers, utils } from 'ethers';
import { BsCalendarPlus } from 'react-icons/bs';
import abi from '../../utils/Metapass.json';
import youtubeThumbnail from 'youtube-thumbnail';
const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});
const MapComponent = dynamic(
  () => import('../../components/Misc/Map.component'),
  {
    ssr: false,
  },
);
import toast from 'react-hot-toast';
import { IoIosLink } from 'react-icons/io';
import Confetti from '../../components/Misc/Confetti.component';
import { ticketToIPFS } from '../../utils/imageHelper';
import toGoogleCalDate from '../../utils/parseIsoDate';
import BoringAva from '../../utils/BoringAva';
import { decryptLink } from '../../utils/linkResolvers';

import generateAndSendUUID from '../../utils/generateAndSendUUID';
import GenerateQR from '../../utils/generateQR';
import { Biconomy } from '@biconomy/mexa';

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
// import * as web3 from '@solana/web3.js'
import {
  getHostPDA,
  getAdminPDA,
  createMintTicketInstruction,
  MintTicketInstructionAccounts,
} from 'metapass-sdk';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  // clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import SignUpModal from '../../components/Modals/SignUp.modal';
import resolveDomains from '../../hooks/useDomain';
import axios from 'axios';
import { generateMetadata } from '../../utils/generateMetadata';
import { useAccount, useSigner } from 'wagmi';
import { supabase } from '../../lib/config/supabaseConfig';
import { RegisterFormModal } from '../../components/Modals/RegisterForm.modal';
import { FiCheckCircle, FiShare } from 'react-icons/fi';
import { handleRegister } from '../../utils/helpers/handleRegister';
import { useRecoilState, useRecoilValue } from 'recoil';
import { navDisclosure, updateOnce } from '../../lib/recoil/atoms';

import MapPinLine from '../../components/Misc/MapPinLine.component';
import AcceptedModalComponent from '../../components/Modals/Accepted.modal';
import { web3Context } from '../../utils/web3Context';
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from '@web3auth/solana-provider';
import { OpenLoginUserWithMetadata, useUser } from '../../hooks/useUser';
import resolveBalance from '../../hooks/useSolBalance';
import Link from 'next/link';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { sendSPL } from '../../utils/sendSpl';
declare const window: any;
interface SolanaWalletWithPublicKey extends SolanaWallet {
  publicKey: PublicKey;
}
function ToWebp(img: string) {
  if (!img) return '';
  return img.slice(-4).includes('.')
    ? img.slice(0, -4).concat('.webp')
    : img.concat('.webp');
}
export default function EventLayout({
  event,
  isInviteOnly,
  // isOpen3,
  onOpen3,
}: // onClose3,
{
  event: Event;
  isInviteOnly: boolean;
  isOpen3: boolean;
  onOpen3: () => void;
  onClose3: () => void;
}) {
  const network = process.env.NEXT_PUBLIC_ALCHEMY_SOLANA as string;
  const connection = new Connection(network);
  const metaplex = new Metaplex(connection);
  const [image, setImage] = useState(ToWebp(event?.image?.gallery[0]));
  const [mediaType, setMediaType] = useState(
    event?.image.video ? 'video' : 'image',
  );
  const [mintedImage, setMintedImage] = useState<string>('');
  const [eventLink, setEventLink] = useState<string>('');
  const { hasCopied, onCopy } = useClipboard(eventLink as string);

  const [hasBought, setHasBought] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [formLoading, setFormLoading] = useState<boolean>(false)
  const [ensName, setEnsName] = useState<string | null>(null);
  const [openseaLink, setToOpenseaLink] = useState<string>('');
  const [hasTicket, setHasTicket] = useState<boolean>(false);
  const [qrId, setQrId] = useState<string>('');
  const [isMapCompatible, setIsMapCompatible] = useState<boolean>(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wallet, setWallet] = useContext<any>(walletContext);
  const [solanaWallet, setSolanaWallet] = useState<
    SolanaWalletWithPublicKey | WalletContextState | null
  >(useWallet());
  const w = useWallet();
  const router = useRouter();
  const { onCopy: onCopy1 } = useClipboard(
    `https://app.metapassh1.xyz/event/${router.query.address}`,
  );
  const mapContainerRef = useRef(null);
  const [web3, setWeb3, web3auth, setWeb3auth]: any = useContext(web3Context);
  metaplex.use(walletAdapterIdentity(w));
  const [explorerLink, setExplorerLink] = useState<string>('');
  const [navDisc, setNavDisc] = useRecoilState(navDisclosure);
  let opensea =
    process.env.NEXT_PUBLIC_ENV === 'dev'
      ? 'https://testnets.opensea.io/assets/mumbai'
      : 'https://opensea.io/assets/matic';

  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const [toOpen, setToOpen] = useState<boolean>(false);
  const [formRes, setFormRes] = useState<
    'Register' | 'Awaiting Approval' | 'Accepted'
  >('Register');
  const toUpdate = useRecoilValue(updateOnce);

  const { user } = useUser();

  useEffect(() => {
    console.log('f1');
    (async function () {
      if (wallet.type == 'web3auth') {
        // setFormLoading(true)

        const privateKey: string = await web3.request({
          method: 'eth_private_key',
        });

        if (event?.isSolana && wallet.address.startsWith('0x')) {
          const { getED25519Key } = await import(
            '@toruslabs/openlogin-ed25519'
          );
          const ed25519key = getED25519Key(privateKey).sk.toString('hex');
          const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
            config: {
              chainConfig: {
                chainId: '0x3',
                rpcTarget: process.env.NEXT_PUBLIC_SOLANA!,
                displayName: 'Solana Mainnet',
                blockExplorer: 'https://explorer.solana.com/',
                ticker: 'SOL',
                tickerName: 'Solana',
              },
            },
          });

          await solanaPrivateKeyProvider.setupProvider(ed25519key);

          const solWallet = new SolanaWallet(
            solanaPrivateKeyProvider.provider as any,
          );

          const solana_address = await solWallet.requestAccounts();
          let balance = await resolveBalance(solana_address[0]);

          if (wallet) {
            setSolanaWallet({
              ...solWallet,
              publicKey: new PublicKey(solana_address[0]),
              signTransaction: solWallet.signTransaction,
            } as SolanaWalletWithPublicKey);
            console.log('balance here', balance);
            setWallet({
              address: solana_address[0],
              balance: balance?.toString(),
              domain: null,
              type: 'web3auth',
              chain: 'SOL',
            });
          }
        } else if (!event?.isSolana && !wallet.address.startsWith('0x')) {
          const w3 = new Web3(web3);
          const userAccounts = await w3.eth.getAccounts();
          let bal = await w3.eth.getBalance(userAccounts[0]);
          setWallet({
            balance: ethers.utils.formatEther(bal),
            address: userAccounts[0],
            type: 'web3auth',
            chain: 'POLYGON',
            domain: null,
          });
        }

        // setFormLoading(false)
      }
    })();
    if ((wallet.type = 'sol')) {
      setSolanaWallet(w);
    }
  }, [wallet.type, w]);

  useEffect(() => {
    async function getData() {
      let a = event?.childAddress as string;
      if (event?.childAddress.startsWith('0x')) {
        a = utils.getAddress(event?.childAddress as string);
      }
      const { data, error } = await supabase
        .from('responses')
        .select('accepted')
        .eq('address', wallet.address)
        .eq('event', a);
      if (data && data?.length > 0) {
        data?.[0]?.accepted
          ? setFormRes('Accepted')
          : setFormRes('Awaiting Approval');
      } else {
        setFormRes('Register');
      }
    }

    getData();
  }, [user?.email, toUpdate, event?.childAddress, wallet.address]);

  useEffect(() => {
    const addUser = async () => {
      try {
        if (user && wallet.address) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('address', wallet.address);
          if (data && data?.length > 0) {
            console.log('User already exists');
          } else {
            const { data, error } = await supabase.from('users').upsert(
              {
                address: wallet.address,
                email: user.email,
                Name: user.user_metadata.name,
                avatar_url: user.user_metadata.avatar_url,
              },

              { returning: 'minimal' },
            );
          }
        }
      } catch (error) {
        console.log('e', error);
      }
    };

    addUser();
  }, [user, wallet.address]);

  const { data: WalletSigner } = useSigner();
  const { isConnected } = useAccount();

  const share = () => {
    onCopy1();
    toast.success('Event link copied to clipboard successfully!', {
      duration: 4000,
    });
  };

  useEffect(() => {
    if (wallet.address) {
      if (
        event?.buyers.find(
          (buyer: any) =>
            String(buyer?.id).toLowerCase() ===
            String(wallet.address).toLowerCase(),
        ) ||
        event?.buyers.find(
          (buyer) =>
            String(buyer).toLowerCase() ===
            String(wallet?.address).toLowerCase(),
        )
      ) {
        setHasTicket(true);
      }
    } else {
      setHasTicket(false);
    }
  }, [wallet.address]);

  let biconomy: any;

  const initBiconomy = async () => {
    if (wallet.type == 'web3auth' && event?.childAddress.startsWith('0x')) {
      biconomy = new Biconomy(web3auth.provider, {
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API as string,
        debug: process.env.NEXT_PUBLIC_ENV == 'dev',
        contractAddresses: [ethers.utils.getAddress(event?.childAddress)],
      });
      await biconomy.init();
    } else {
      biconomy = new Biconomy((WalletSigner?.provider as any).provider, {
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API as string,
        debug: process.env.NEXT_PUBLIC_ENV == 'dev',
        contractAddresses: [ethers.utils.getAddress(event?.childAddress)],
      });
      await biconomy.init();
    }
  };

  useEffect(() => {
    if (
      event?.childAddress.startsWith('0x') &&
      (WalletSigner?.provider ||
        (wallet.address && wallet.address.startsWith('0x')))
    ) {
      initBiconomy();
      console.log('init bico', wallet.address, WalletSigner?.provider);
    }
  }, [wallet.address]);

  const buyPolygonTicket = async () => {
    if (
      (isConnected || (wallet.address && wallet.address.startsWith('0x'))) &&
      biconomy
    ) {
      if (user === null) {
        setToOpen(true);
      } else {
        setIsLoading(true);
        toast.loading('Generating your unique ticket', {
          duration: 5000,
        });
        let { img, fastimg } = await ticketToIPFS(
          event?.title,
          event?.tickets_sold + 1,
          event?.image.image,
          event?.date.split('T')[0],
          wallet?.domain ||
            wallet?.address?.substring(0, 4) +
              '...' +
              wallet?.address?.substring(wallet?.address?.length - 4),
        );
        setMintedImage(fastimg);
        let metadata = {
          name: event?.title,
          description: `NFT Ticket for ${event?.title}`,
          image: img,
          properties: {
            'Ticket Number': event?.tickets_sold + 1,
          },
        };

        if (event?.fee === 0) {
          try {
            let ethersProvider = biconomy.provider;
            let metapass = new ethers.Contract(
              event?.childAddress,
              abi.abi,
              biconomy.ethersProvider,
            );
            let { data } = await metapass.populateTransaction.getTix(
              JSON.stringify(metadata),
              {
                value: ethers.utils.parseEther(event?.fee.toString()),
                gasPrice: 50,
                gasLimit: 900000,
              },
            );
            let txParams = {
              data: data,
              to: event?.childAddress,
              from: wallet.address,
              signatureType: 'EIP712_SIGN',
            };
            await ethersProvider.send('eth_sendTransaction', [txParams]);

            biconomy.on('txHashGenerated', (data: any) => {
              setIsLoading(false);
              setHasBought(true);
              let link =
                opensea + '/' + event?.childAddress + '/' + event?.tickets_sold;

              setToOpenseaLink(link);
              if (event?.category.event_type == 'In-Person') {
                generateAndSendUUID(
                  ethers.utils.getAddress(event?.childAddress),
                  wallet.address as string,
                  event?.tickets_sold + 1,
                  fastimg,
                ).then((uuid) => {
                  setQrId(String(uuid));
                });
              }
            });
            biconomy.on(
              'onError',
              (data: { error: any; transactionId: string }) => {
                toast.error('Ooops! Failed to mint the ticket.');
                setIsLoading(false);
                if (
                  data.error.reason ==
                  'execution reverted: Already minted tickets'
                ) {
                  toast.error('Tickets Already Minted!');
                }
              },
            );
            setIsLoading(false);
          } catch (e: any) {
            console.log(e, 'error');
          }
        } else {
          try {
            let metapass = new ethers.Contract(
              event?.childAddress,
              abi.abi,
              WalletSigner?.provider,
            );
            let txn = await metapass.getTix(JSON.stringify(metadata), {
              value: ethers.utils.parseEther(event?.fee.toString()),
            });
            setIsLoading(false);
            if (event?.category.event_type == 'In-Person') {
              generateAndSendUUID(
                ethers.utils.getAddress(event?.childAddress),
                wallet.address as string,
                event?.tickets_sold + 1,
                fastimg,
              ).then((uuid) => {
                setQrId(String(uuid));
              });
              setHasBought(true);
              let link =
                opensea + '/' + event?.childAddress + '/' + event?.tickets_sold;

              setToOpenseaLink(link);
            }
          } catch (e) {
            console.log(e);
            toast.error("Mint wasn't successful!");
            setIsLoading(false);
          }
        }
      }
    } else if (wallet.address && wallet.address.startsWith('0x') && !biconomy) {
      setIsLoading(true);

      await initBiconomy();
      await buyPolygonTicket();
    } else {
      toast.error('Please connect your Polygon wallet', {
        id: 'con-polygon',
      });
    }
  };
  const buySolanaTicket = async () => {
    console.log(
      'buying solana ticket',
      (solanaWallet as SolanaWalletWithPublicKey).signTransaction,
    );
    if (!user) {
      setToOpen(true);
    } else {
      if (solanaWallet && solanaWallet.publicKey) {
        setIsLoading(true);
        const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
          'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        );
        const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
          'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        );
        // event?.customSPLToken =
        //     'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        const customSPL = new PublicKey(
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        );
        if (event?.fee === 0) {
          const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
            return (
              await PublicKey.findProgramAddress(
                [
                  Buffer.from('metadata'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  mint.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              )
            )[0];
          };

          const getMasterEdition = async (
            mint: PublicKey,
          ): Promise<PublicKey> => {
            return (
              await PublicKey.findProgramAddress(
                [
                  Buffer.from('metadata'),
                  TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                  mint.toBuffer(),
                  Buffer.from('edition'),
                ],
                TOKEN_METADATA_PROGRAM_ID,
              )
            )[0];
          };

          const mint = Keypair.generate();
          const metadataAddress = await getMetadata(mint.publicKey);
          const masterEdition = await getMasterEdition(mint.publicKey);
          const NftTokenAccount: PublicKey = await getAssociatedTokenAddress(
            mint.publicKey,
            solanaWallet.publicKey as PublicKey,
          );
          const hostPDA: PublicKey = await getHostPDA(
            new PublicKey(event?.eventHost),
          );
          const adminPDA: PublicKey = await getAdminPDA();

          const hostCustomSplTokenAta = await getAssociatedTokenAddress(
            customSPL,
            new PublicKey(event?.eventHost), // the receiver
          );
          const adminCustomSplTokenATA = await getAssociatedTokenAddress(
            customSPL,
            new PublicKey('4ZVmtujXR4PQVT73r43AD3qKHoUgAvAcw69djR9UP5Pw'),
          );
          const senderCustomTokenATA: PublicKey =
            await getAssociatedTokenAddress(
              customSPL,
              solanaWallet.publicKey as PublicKey,
            );
          const accounts: MintTicketInstructionAccounts = {
            mintAuthority: solanaWallet.publicKey as PublicKey,
            eventAccount: new PublicKey(event?.childAddress),
            mint: mint.publicKey,
            metadata: metadataAddress,
            tokenAccount: NftTokenAccount,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            payer: solanaWallet.publicKey as PublicKey,
            masterEdition: masterEdition,
            eventHost: hostPDA,

            eventHostKey: new PublicKey(event?.eventHost),
            adminAccount: adminPDA,
            adminKey: new PublicKey(
              '4ZVmtujXR4PQVT73r43AD3qKHoUgAvAcw69djR9UP5Pw',
            ),
            customSplToken: customSPL,
            customSplTokenProgram: TOKEN_PROGRAM_ID,
            senderCustomSplTokenAta: senderCustomTokenATA,
            hostCustomSplTokenAta: hostCustomSplTokenAta,
            adminCustomTokenAta: adminCustomSplTokenATA,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          };
          toast.loading('Generating your unique ticket', {
            duration: 5000,
          });
          const { img, fastimg } = await ticketToIPFS(
            event?.title,
            event?.tickets_sold + 1,
            event?.image.image,
            event?.date.split('T')[0],
            wallet?.domain ||
              wallet?.address?.substring(0, 4) +
                '...' +
                wallet?.address?.substring(wallet?.address?.length - 4),
          );
          const uri = await generateMetadata(event, img);

          const transactionInstruction = createMintTicketInstruction(accounts, {
            uri:
              uri ||
              'https://cdukzux2wfzaaxbnissg6emgojrtdxzw5klsqnpmqhcusvi.arweave.net/EOis0vqxcg_BcLUSkbxGG-c_mMx3zbq-lyg17IHFSVU',
          });
          const additionalComputeBudgetInstruction =
            ComputeBudgetProgram.requestUnits({
              units: 300000,
              additionalFee: 0,
            });
          const transaction = new Transaction()
            .add(additionalComputeBudgetInstruction)
            .add(transactionInstruction);
          console.log('tx', uri, 'uri');
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = solanaWallet.publicKey as PublicKey;
          console.log('w', solanaWallet);
          if (solanaWallet.signTransaction) {
            try {
              transaction.sign(mint);
              const signedTx = await solanaWallet.signTransaction(transaction);
              const txid = await connection.sendRawTransaction(
                signedTx.serialize(),
                {
                  preflightCommitment: 'finalized',
                  // skipPreflight: true,
                },
              );
              await axios.post(`/api/buyTicket`, {
                eventPDA: event?.childAddress,
                publicKey: solanaWallet.publicKey?.toString(),
              });

              setExplorerLink(
                `https://solscan.io/tx/${txid}?cluster=${network}`,
              );

              setMintedImage(fastimg);
              setHasBought(true);
              setIsLoading(false);

              event?.category.event_type == 'In-Person' &&
                generateAndSendUUID(
                  event?.childAddress,
                  wallet.address as string,
                  event?.tickets_sold + 1,
                  fastimg,
                ).then((uuid) => {
                  setQrId(String(uuid));
                });
            } catch (error) {
              const e = error as Error;
              if (e.message.includes('0x1')) {
                toast.error("You don't have enough funds");
              } else if (
                e.message.includes(
                  'Attempt to debit an account but found no record of a prior credit.',
                )
              ) {
                toast.error("You don't have enough funds in your wallet");
              }
              console.log(
                'Error in sending txn, line 323, Event.layout.tsx',
                error,
              );
              setIsLoading(false);
            }
          } else {
            throw Error('signTransaction is undefined, event?.layout.tsx');
          }
        } else {
          try {
            const tx = await sendSPL(
              'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
              solanaWallet.publicKey as PublicKey,
              new PublicKey('4ZVmtujXR4PQVT73r43AD3qKHoUgAvAcw69djR9UP5Pw'),
              Number(event.fee),
              connection,
            );

            const signedTx = await solanaWallet.signTransaction!(tx!);
            console.log(signedTx);

            const signature = await connection.sendRawTransaction(
              signedTx!.serialize(),
            );
            if (signature) {
              const { img, fastimg } = await ticketToIPFS(
                event?.title,
                event?.tickets_sold + 1,
                event?.image.image,
                event?.date.split('T')[0],
                wallet?.domain ||
                  wallet?.address?.substring(0, 4) +
                    '...' +
                    wallet?.address?.substring(wallet?.address?.length - 4),
              );
              const uri = await generateMetadata(event, img);
              const { response } = await metaplex.nfts().create({
                uri: uri,
                name: 'My NFT',
                sellerFeeBasisPoints: 500, // Represents 5.00%.
              });
              await axios.post(`/api/buyTicket`, {
                eventPDA: event?.childAddress,
                publicKey: solanaWallet.publicKey?.toString(),
              });
              response.signature;
              setExplorerLink(
                `https://solscan.io/tx/${response.signature}?cluster=${network}`,
              );
              setMintedImage(fastimg);
              setHasBought(true);
              setIsLoading(false);
            }

            // if (solanaWallet.signTransaction) {
            //
            //

            //       setExplorerLink(
            //         `https://solscan.io/tx/${txid}?cluster=${network}`,
            //       );

            //       setMintedImage(fastimg);
            //       setHasBought(true);
            //       setIsLoading(false);

            //       event?.category.event_type == 'In-Person' &&
            //         generateAndSendUUID(
            //           event?.childAddress,
            //           wallet.address as string,
            //           event?.tickets_sold + 1,
            //           fastimg,
            //         ).then((uuid) => {
            //           setQrId(String(uuid));
            //         });
            //     } catch (error) {
            //       const e = error as Error;
            //       if (e.message.includes('0x1')) {
            //         toast.error("You don't have enough funds");
            //       } else if (
            //         e.message.includes(
            //           'Attempt to debit an account but found no record of a prior credit.',
            //         )
            //       ) {
            //         toast.error("You don't have enough funds in your wallet");
            //       }
            //       console.log(
            //         'Error in sending txn, line 323, Event.layout.tsx',
            //         error,
            //       );
            //       setIsLoading(false);
            //     }
            //   } else {
            //     throw Error('signTransaction is undefined, event?.layout.tsx');
            //   }
            // }
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        console.log(solanaWallet?.publicKey);
        toast.error('Please connect your Solana Wallet', {
          id: 'connect-sol-wal',
        });
      }
    }
  };

  const clickBuyTicket = async () => {
    if (wallet.address) {
      if (user) {
        if (isInviteOnly) {
          if (formRes === 'Register') {
            // setFormLoading(true)
            console.log('registering');
            if (
              (event?.isSolana && wallet.chain === 'SOL') ||
              (!event?.isSolana && wallet.chain === 'POLYGON')
            ) {
              await handleRegister(
                user as OpenLoginUserWithMetadata,
                onOpen2,
                setToOpen,
                event?.childAddress,
                wallet.address as string,
              );
            } else {
              !(wallet.type === 'web3auth') &&
                toast.error(
                  `Please connect your ${
                    event?.isSolana ? 'Solana' : 'Polygon'
                  } wallet!`,
                );
            }
          }
          if (formRes === 'Accepted') {
            event?.isSolana ? buySolanaTicket() : buyPolygonTicket();
          }
        } else {
          if (event?.isSolana) {
            buySolanaTicket();
          } else {
            buyPolygonTicket();
          }
        }
      } else {
        console.log('no user');
        wallet.type === 'web3auth' ? onOpen3() : onOpen();
      }
    } else {
      wallet.type === null &&
        toast.error('Please make sure your wallet has loaded or is connected');

      navDisc.onOpen();
    }
  };
  useEffect(() => {
    const resolve = async () => {
      const domain = await resolveDomains(
        event?.isSolana ? 'SOL' : 'POLYGON',
        event?.owner,
      );
      domain && setEnsName(domain?.domain as string);
    };
    resolve();
  }, [event?.owner]);

  useEffect(() => {
    if (event?.link) {
      if (event?.link.includes('huddle')) {
        setEventLink(event?.link);
      } else {
        const declink = decryptLink(event?.link as string);
        setEventLink(declink as string);
      }
    }
  }, [event?.link]);

  const [isDisplayed, setIsDisplayed] = useState(false);
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  useEffect(() => {
    if (hasBought) {
      setInterval(() => {
        setIsDisplayed(true);
      }, 5000);
    }
  }, [hasBought]);
  const datetouse = event.date.split('T')[0].split(':').reverse();
  const timetouse = event.date?.split('T')[1];
  const startTime =
    event?.date?.split('T')[0]?.split(':').join('-') +
    ' ' +
    event?.date?.split('T')[1]?.split('-')[0];
  const endTime =
    event?.date.split('T')[0]?.split(':').join('-') +
    ' ' +
    event?.date?.split('T')[1]?.split('-')[1];
  // console.log(
  //   moment.utc(startTime).format('LT'),
  //   moment.utc(endTime).format('LT'),
  // );

  return (
    <>
      {isOpen && (
        <SignUpModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={() => {
            setToOpen(false);
            onClose();
          }}
        />
      )}
      {isOpen2 && (
        <RegisterFormModal
          isOpen={isOpen2}
          onOpen={onOpen2}
          onClose={onClose2}
          event={event}
        />
      )}

      {hasBought && <Confetti />}
      {formRes === 'Accepted' && <Confetti />}
      {formRes === 'Accepted' && (
        <AcceptedModalComponent
          isApproved={formRes === 'Accepted'}
          event={event}
          mail={user?.email as string}
        />
      )}
      <Modal isOpen={!isDisplayed && hasBought} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent rounded='2xl' bgColor={'transparent'}>
          <motion.div
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ ease: 'easeOut', duration: 3 }}
          >
            <Image src={mintedImage} loading='lazy' alt='ticket' m='2'></Image>
          </motion.div>
        </ModalContent>
      </Modal>
      <Fade>
        <Modal isOpen={isDisplayed} onClose={() => {}}>
          <ModalOverlay />
          <ModalContent rounded='2xl'>
            <ModalBody textAlign='center'>
              <motion.div
                animate={{ translateY: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Image
                  src={mintedImage}
                  alt='ticket'
                  m='2'
                  loading='lazy'
                ></Image>
              </motion.div>
              <Box color='blackAlpha.700' fontSize='sm'>
                <Text fontFamily='body' fontSize='lg' color='blackAlpha.800'>
                  Radical! 🎊
                </Text>
                <Text mt='2'>Enjoy your time at {event?.title}</Text>
                <Text mt='2'>The ticket has been sent to your wallet.🥂</Text>
                <Text mt='2'>Spread the word, share this event via </Text>
              </Box>
              <Flex
                mx='auto'
                mt='2'
                justify='center'
                experimental_spaceX='2'
                align='center'
              >
                <Box
                  p='2'
                  bg='white'
                  transitionDuration='100ms'
                  cursor='pointer'
                  boxShadow='0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)'
                  rounded='full'
                  _hover={{ shadow: 'md' }}
                >
                  <Image
                    src='/assets/twitter.png'
                    w='5'
                    alt='twitter'
                    onClick={() => {
                      window.open(
                        `http://twitter.com/share?text=I bought my NFT Ticket for ${event?.title} on @metapassHQ. Get yours now!&url=https://app.metapasshq.xyz/event/${event?.childAddress}`,
                        '_blank',
                      );
                    }}
                  />
                </Box>

                <Box
                  p='2'
                  bg='white'
                  transitionDuration='100ms'
                  cursor='pointer'
                  boxShadow='0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)'
                  rounded='full'
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send?text=I just bought NFT Ticket to ${event?.title} on Metapass. Get yours at https://app.metapasshq.xyz/event/${event?.childAddress}`,
                    );
                  }}
                  _hover={{ shadow: 'md' }}
                >
                  <Image src='/assets/whatsapp.png' w='5' alt='whatsapp' />
                </Box>
                <Box
                  p='2'
                  bg='white'
                  transitionDuration='100ms'
                  cursor='pointer'
                  boxShadow='0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)'
                  rounded='full'
                  onClick={() => {
                    window.open(
                      `https://telegram.me/share/url?url=https://app.metapasshq.xyz/event/${event?.childAddress}&text=I just bought my NFT Ticket to ${event?.title} on Metapass. Get yours now`,
                      '_blank',
                    );
                  }}
                  _hover={{ shadow: 'md' }}
                >
                  <Image src='/assets/telegram.png' w='5' alt='telegram' />
                </Box>
                <Box
                  p='2'
                  bg='white'
                  transitionDuration='100ms'
                  cursor='pointer'
                  boxShadow='0px 4.61667px 92.3333px rgba(0, 0, 0, 0.15)'
                  rounded='full'
                  _hover={{ shadow: 'md' }}
                  onClick={() => {
                    window.open(
                      event?.isSolana ? explorerLink : openseaLink,
                      '_blank',
                    );
                  }}
                >
                  <Img
                    src={
                      event?.isSolana
                        ? '/assets/solscan.png'
                        : '/assets/opensea.png'
                    }
                    w='5'
                    alt='opensea'
                    borderRadius='full'
                  />
                </Box>
              </Flex>
              <Text color='blackAlpha.700' fontSize='sm' mt='2'>
                {event?.category.event_type == 'In-Person'
                  ? 'Save this QR Code'
                  : 'Or copy this link'}
              </Text>
              {event?.category.event_type != 'In-Person' && (
                <>
                  <InputGroup mt='4'>
                    <InputLeftElement>
                      <IoIosLink />
                    </InputLeftElement>
                    <Input
                      rounded='full'
                      fontSize='xs'
                      value={eventLink}
                      readOnly
                    />
                    <InputRightElement mr='6'>
                      <Button
                        onClick={onCopy}
                        _hover={{}}
                        _focus={{}}
                        _active={{}}
                        rounded='full'
                        color='white'
                        bg='brand.gradient'
                        fontWeight='normal'
                        fontSize='sm'
                        px='12'
                        roundedBottomLeft='none'
                      >
                        {hasCopied ? 'Copied' : 'Copy Link'}
                      </Button>
                    </InputRightElement>{' '}
                  </InputGroup>
                </>
              )}
              {event?.category.event_type == 'In-Person' && (
                <Flex justify='center'>
                  <Box
                    borderRadius='2xl'
                    border='1px'
                    borderColor='blackAlpha.200'
                    boxShadow='0px -4px 52px rgba(0, 0, 0, 0.11)'
                  >
                    {' '}
                    <GenerateQR data={qrId} />
                  </Box>
                </Flex>
              )}
              <Box mt='2' mb='4'>
                <Link href='/' passHref>
                  <ChakraLink fontSize='sm' color='blackAlpha.600'>
                    Back to home
                  </ChakraLink>
                </Link>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Fade>
      <Box pt='3' color='brand.black' mb='4'>
        <Flex
          justify='space-between'
          align={{ md: 'center' }}
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Flex gap={3}>
            <Box pl={{ md: '2' }}>
              <Text fontSize='2xl' fontWeight='semibold'>
                {event?.title}
              </Text>
              <Box>
                <Text color={'red.300'} fontWeight={600} fontSize='sm'>
                  {datetouse[0]} {months[parseInt(datetouse[1]) - 1]} {'  '}{' '}
                  {datetouse[2]}
                  {', '}
                  {moment.utc(startTime).local().format('LT') +
                    ' - ' +
                    moment.utc(endTime).local().format('LT')}
                  {'  '}
                </Text>
              </Box>

              {/* <Flex mt="1" flexDirection="column"> */}
              <Flex
                experimental_spaceX='2'
                color='blackAlpha.600'
                mt='1'
                mr='4'
              >
                <Box
                  boxShadow='0px 0px 31.1248px rgba(0, 0, 0, 0.08)'
                  rounded='full'
                  fontSize='10px'
                  fontWeight='semibold'
                  border='1px'
                  borderColor='blackAlpha.200'
                  px='2'
                  py='0.5'
                  bg='white'
                >
                  {event?.type || event?.category.event_type}
                </Box>

                <Box
                  boxShadow='0px 0px 31.1248px rgba(0, 0, 0, 0.08)'
                  rounded='full'
                  fontSize='10px'
                  fontWeight='semibold'
                  border='1px'
                  borderColor='blackAlpha.200'
                  px='2'
                  py='0.5'
                  bg='white'
                >
                  {Array(event?.category.category).join(' & ')}
                </Box>
              </Flex>
            </Box>
            <Button onClick={share} variant={'unstyled'}>
              <FiShare />
            </Button>
          </Flex>
          <Button
            display={{ base: 'none', md: 'flex' }}
            rounded='full'
            bg='brand.gradient'
            fontWeight='medium'
            role='group'
            loadingText={'Minting'}
            isLoading={isLoading}
            boxShadow='0px 4px 32px rgba(0, 0, 0, 0.12)'
            color='white'
            _disabled={{
              opacity: '0.8',
              cursor: 'not-allowed',
            }}
            _hover={{}}
            onClick={clickBuyTicket}
            disabled={
              event?.tickets_available === 0 ||
              formRes === 'Awaiting Approval' ||
              formRes === 'Accepted' ||
              hasTicket
            }
            _focus={{}}
            _active={{}}
            w={{ base: '70%', md: 'auto' }}
            mr='3'
            leftIcon={
              <Box
                _groupHover={{ transform: 'scale(1.1)' }}
                transitionDuration='100ms'
              >
                {isInviteOnly ? (
                  <FiCheckCircle size={22} />
                ) : (
                  <Image
                    src='/assets/elements/event_ticket.svg'
                    w={{ base: '6', md: '5' }}
                    alt='ticket'
                  />
                )}
              </Box>
            }
          >
            {isInviteOnly ? (
              <>{formRes}</>
            ) : event?.tickets_available === 0 ? (
              'Sold Out'
            ) : hasTicket ? (
              'Already Bought'
            ) : (
              'Buy Ticket'
            )}
          </Button>
        </Flex>
        <Flex
          align='start'
          mt='4'
          experimental_spaceX={{ base: '0', md: '6' }}
          justify='space-between'
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box w='full'>
            <Box
              mb={{ base: '8', md: '0' }}
              w='full'
              overflow='clip'
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)'
              rounded='xl'
              p={{ base: '0', md: '3' }}
            >
              <Flex
                alignItems={{
                  base: 'stretch',
                  md: 'end',
                }}
                experimental_spaceX='4'
                flexDir={{ base: 'column', md: 'row' }}
              >
                <AspectRatio
                  ratio={16 / 9}
                  w='full'
                  rounded='lg'
                  overflow='hidden'
                >
                  {mediaType === 'video' ? (
                    <Flex justify='center' align='center' w='full'>
                      <ReactPlayer
                        height='100%'
                        width='100%'
                        url={event?.image.video}
                      />
                    </Flex>
                  ) : (
                    <Image src={image} alt={'Event Image'} /> // @ts-ignore
                  )}
                </AspectRatio>
                <Box
                  display={{ base: 'none', md: 'block' }}
                  maxH={{ base: '26vw', xl: '300px' }}
                  minW={{
                    md: '100px',
                    lg: '130px',
                  }}
                  overflowY='auto'
                >
                  <Flex
                    py={{ base: '2', md: '1' }}
                    px='1'
                    flexDir={{
                      base: 'row',
                      md: 'column',
                    }}
                    minW={{
                      base: '60px',
                      md: '90px',
                      lg: '110px',
                    }}
                    experimental_spaceY='2'
                  >
                    {event?.image.video && (
                      <AspectRatio
                        cursor='pointer'
                        _hover={{
                          filter: 'brightness(90%)',
                        }}
                        transitionDuration='100ms'
                        onClick={() => {
                          setMediaType('video');
                        }}
                        ratio={16 / 9}
                        w='full'
                        ringColor='brand.peach'
                        ring={mediaType === 'video' ? '2px' : 'none'}
                        rounded='md'
                        overflow='hidden'
                      >
                        <Image
                          src={
                            youtubeThumbnail(event?.image.video).default.url
                              ? youtubeThumbnail(event?.image.video).default.url
                              : 'https://pdtxar.com/wp-content/uploads/2019/11/video-placeholder-1280x720-40-768x433.jpg'
                          }
                          alt={'thumbnail'}
                        />
                      </AspectRatio>
                    )}
                    {event?.image.gallery?.map((data, key) => (
                      <AspectRatio
                        key={key}
                        cursor='pointer'
                        _hover={{
                          filter: 'brightness(90%)',
                        }}
                        transitionDuration='100ms'
                        onClick={() => {
                          setImage(data);
                          setMediaType('image');
                        }}
                        ratio={2.24}
                        w='full'
                        mx={{ base: '1', md: '0' }}
                        ringColor='brand.peach'
                        ring={
                          image === data && mediaType === 'image'
                            ? '2px'
                            : 'none'
                        }
                        rounded='md'
                        overflow='hidden'
                      >
                        <Image src={ToWebp(data)} alt={ToWebp(data)} />
                      </AspectRatio>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Box>
            {/* <Box
              display={{ base: 'block', md: 'none' }}
              mt={{ base: '-8', md: '0' }}
              mb='8'
              ml='4'
            >
              <Text color={'red.300'} fontWeight={600} fontSize='sm'>
                {datetouse[0]} {months[parseInt(datetouse[1])]} {'  '}{' '}
                {datetouse[2]}
                {', '}
                {moment.utc(startTime).local().format('LT') +
                  ' - ' +
                  moment.utc(endTime).local().format('LT')}
                {'  '}
              </Text>
            </Box> */}
            <Box
              w='full'
              mt={2}
              mb={{ base: '10px', md: '0' }}
              noOfLines={6}
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)'
              rounded='xl'
              p='3'
              fontFamily='body'
              px='4'
              color='blackAlpha.700'
              textAlign={{ base: 'center', lg: 'left' }}
              fontSize={{ base: 'sm', lg: 'md' }}
              display={{ base: 'none', md: 'block' }}
              minH={{ base: '4rem', md: 'auto' }}
              maxH={{ base: '14rem', md: 'auto' }}
              maxW='740px'
              overflow='auto'
            >
              <Text fontWeight={'semibold'} decoration='underline' mb={2}>
                Description:
              </Text>
              <Box display={{ base: 'block', md: 'block' }}>
                <MarkdownPreview
                  style={{
                    fontSize: event?.description.long_desc ? '17px' : '14px',
                    overflow: 'auto',
                  }}
                  source={
                    event?.description.long_desc ||
                    event?.description.short_desc
                  }
                />
              </Box>
            </Box>

            <Flex
              justify='center'
              display={{ base: 'flex', md: 'none' }}
              backgroundColor='white'
              w='100%'
              flexDirection='column'
              position='fixed'
              bottom='0'
              align='center'
              zIndex={10}
              pb='1'
              pt='4'
              borderTopRightRadius={20}
              borderTopLeftRadius={20}
              left='0'
            >
              <Flex align='center' gap='2'>
                <Text color='blackAlpha.500' fontSize='xs'>
                  Hosted By
                </Text>
                <Flex mt='2' direction='column' mb='1'>
                  <Flex
                    experimental_spaceX='2'
                    align='center'
                    _hover={{ bg: 'blackAlpha.50' }}
                    mx='-4'
                    px='4'
                    py='2'
                    cursor='pointer'
                    transitionDuration='100ms'
                  >
                    <BoringAva address={event?.owner} />
                    <Box>
                      <Text fontSize='14px' w='32'>
                        {ensName
                          ? ensName?.length > 15
                            ? ensName?.slice(0, 6) + '...' + ensName?.slice(-6)
                            : ensName ||
                              event?.owner?.slice(0, 6) +
                                '...' +
                                event?.owner?.slice(-6)
                          : event?.owner?.slice(0, 6) +
                            '...' +
                            event?.owner?.slice(-6)}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
              <Button
                rounded='full'
                bg='brand.gradient'
                fontWeight='medium'
                role='group'
                loadingText={'Minting'}
                isLoading={isLoading}
                boxShadow='0px 4px 32px rgba(0, 0, 0, 0.12)'
                color='white'
                _disabled={{
                  opacity: '0.8',
                  cursor: 'not-allowed',
                }}
                _hover={{}}
                onClick={clickBuyTicket}
                disabled={
                  event?.tickets_available === 0 ||
                  formRes === 'Awaiting Approval' ||
                  formRes === 'Accepted'
                }
                _focus={{}}
                _active={{}}
                w={{ base: '80%', md: 'auto' }}
                mr='3'
                mb='3'
                leftIcon={
                  <Box
                    _groupHover={{
                      transform: 'scale(1.1)',
                    }}
                    transitionDuration='100ms'
                  >
                    {isInviteOnly ? (
                      <FiCheckCircle size={22} />
                    ) : (
                      <Image
                        src='/assets/elements/event_ticket.svg'
                        w={{ base: '6', md: '5' }}
                        alt='ticket'
                      />
                    )}
                  </Box>
                }
              >
                {isInviteOnly
                  ? formRes
                  : event?.tickets_available === 0
                  ? 'Sold Out'
                  : hasTicket
                  ? 'Already Bought'
                  : 'Buy Ticket'}
              </Button>
            </Flex>
          </Box>
          <Flex direction='column' w={{ base: 'full', md: 'auto' }}>
            <Flex
              experimental_spaceX='2.5'
              w={{ base: 'full', md: 'auto' }}
              flexDirection={{ base: 'row', md: 'row' }}
            >
              {
                <Box
                  p='2'
                  border='1px'
                  borderColor='blackAlpha.100'
                  rounded='xl'
                  textAlign='center'
                  w={{ base: 'full', md: 'auto' }}
                  minW={{ base: 'auto', md: '100px' }}
                  boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
                >
                  <Text fontSize='xs' color='blackAlpha.700'>
                    Ticket Price
                  </Text>
                  <Divider my='2' />
                  <Box w='fit-content' mx='auto'>
                    <Image
                      src={
                        event?.isSolana
                          ? event?.customSPLToken
                            ? event?.customSPLToken.startsWith('EPjFWdd5Auf')
                              ? '/assets/tokens/USDC.svg'
                              : '/assets/tokens/USDT.svg'
                            : '/assets/tokens/SOL.svg'
                          : '/assets/matic.png'
                      }
                      alt='matic'
                      w='6'
                      h='6'
                    />
                  </Box>
                  <Text
                    fontSize={event?.fee === 0 ? 'lg' : '2xl'}
                    fontWeight='semibold'
                    mt={event?.fee === 0 ? '1.5' : '0'}
                  >
                    {event?.fee === 0 ? 'FREE' : event?.fee}
                  </Text>
                </Box>
              }
              <Box
                p='2'
                border='1px'
                borderColor='blackAlpha.100'
                rounded='xl'
                textAlign='center'
                w={{ base: 'full', md: 'auto' }}
                minW={{ base: 'auto', md: '100px' }}
                boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
              >
                <Text fontSize='xs' color='blackAlpha.700'>
                  Event Date
                </Text>
                <Divider my='2' />
                <Text color='brand.peach'>
                  {
                    months[
                      moment(
                        event?.date.split('T')[0]?.split(':').join('-'),
                      ).get('month')
                    ]
                  }
                </Text>
                <Text fontSize='2xl' fontWeight='semibold'>
                  {moment(event?.date.split('T')[0]?.split(':').join('-')).get(
                    'date',
                  )}
                </Text>
              </Box>
            </Flex>
            <Box
              mt='3'
              rounded='xl'
              px='4'
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
              py='2'
              alignItems={'center'}
            >
              <Flex
                justify='space-between'
                align='center'
                justifyContent='center'
                flexDirection={event?.seats >= 10000000 ? 'row' : 'column'}
              >
                {event?.seats >= 10000000 ? (
                  <Box
                    p='2'
                    // border="1px"
                    // borderColor="blackAlpha.100"
                    display='flex'
                    flexDirection='column'
                    rounded='xl'
                    textAlign='center'
                    alignItems='center'
                    w={{ base: 'full', md: 'auto' }}
                    minW={{ base: 'auto', md: '100px' }}
                    // boxShadow="0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)"
                  >
                    <Text fontSize='sm' color='blackAlpha.700'>
                      Tickets Sold
                    </Text>
                    <Divider my='2' />
                    <Flex gap={1}>
                      {' '}
                      <Image
                        src='/assets/ticketgradient.svg'
                        alt='ticket'
                        w='8'
                        transform='rotate(-45deg);'
                      ></Image>
                      <Divider my='2' />
                      <Text fontSize='2xl' fontWeight='semibold'>
                        {event?.tickets_sold}
                      </Text>
                    </Flex>
                  </Box>
                ) : (
                  <Flex>
                    <Flex
                      fontSize='xs'
                      align='center'
                      justifyContent={'space-between'}
                      gap={5}
                    >
                      <Text
                        color='blackAlpha.500'
                        fontSize='xs'
                        // mr="10?"
                      >
                        Tickets Sold
                      </Text>
                      <Flex align={'center'}>
                        <Text
                          fontWeight='bold'
                          style={{
                            background:
                              '-webkit-linear-gradient(360deg, #95E1FF 0%, #E7B0FF 51.58%, #FFD27B 111.28%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {event?.tickets_sold}
                        </Text>
                        <Text fontSize='x-small'>/</Text>
                        <Text> {event?.seats}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                )}
              </Flex>
              {event?.seats >= 10000000 ? null : (
                <>
                  <Flex
                    w='full'
                    h='5'
                    bg='brand.gradient'
                    rounded='full'
                    mt='2'
                    justify='end'
                    overflow='hidden'
                  >
                    {/* {console.log((event?.tickets_sold / event?.seats) * 100, event?.seats,event?.title,event?.tickets_sold,"perc")} */}
                    <Box
                      w={`${100 - (event?.tickets_sold / event?.seats) * 100}%`}
                      h='full'
                      bg='gray.100'
                    />
                  </Flex>
                </>
              )}
            </Box>
            <Box
              w='full'
              mt={2}
              mb={{ base: '10px', md: '0' }}
              noOfLines={6}
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 4.25554px 93.6219px rgba(0, 0, 0, 0.08)'
              rounded='xl'
              p='3'
              fontFamily='body'
              px='4'
              color='blackAlpha.700'
              textAlign={{ base: 'center', lg: 'left' }}
              fontSize={{ base: 'sm', lg: 'md' }}
              display={{ base: 'block', md: 'none' }}
              minH={{ base: '4rem', md: 'auto' }}
              maxH={{ base: '14rem', md: 'auto' }}
              maxW='740px'
              overflow='auto'
            >
              <Text fontWeight={'semibold'} decoration='underline' mb={2}>
                Description:
              </Text>
              <Box display={{ base: 'block', md: 'block' }}>
                <MarkdownPreview
                  style={{
                    fontSize: event?.description.long_desc ? '17px' : '14px',
                    overflow: 'auto',
                  }}
                  source={
                    event?.description.long_desc ||
                    event?.description.short_desc
                  }
                />
              </Box>
            </Box>

            {event?.venue?.name && (
              <Box
                mt='3'
                rounded='xl'
                px='4'
                border='1px'
                borderColor='blackAlpha.100'
                boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
                py='2'
                maxW={{ base: 'auto', md: '18rem' }}
              >
                <Flex
                  justify='flex-end'
                  align='center'
                  flexDirection='row-reverse'
                  gap='2'
                >
                  <Text
                    color='blackAlpha.700'
                    fontSize='16px'
                    fontFamily='Poppins'
                    fontWeight='700'
                    lineHeight='24px'
                  >
                    Location
                  </Text>
                  <Flex fontSize='xs' align='center'>
                    <MapPinLine />
                  </Flex>
                </Flex>
                <ChakraLink
                  textDecoration='underline'
                  color='blackAlpha.600'
                  onClick={() => {
                    window.open(
                      `https://maps.google.com/?q=${event?.venue?.name}`,
                      '_blank',
                    );
                  }}
                >
                  <Text
                    color='blackAlpha.600'
                    // as="u"
                    fontSize='16px'
                    fontFamily='Poppins'
                    fontWeight='500'
                    lineHeight='24px'
                    my={2}
                  >
                    {event?.venue.name.substring(
                      0,
                      event?.venue.name.indexOf(','),
                    ) || event?.venue.name}
                    {' - Open in Maps ↗'}
                  </Text>
                </ChakraLink>
                <MapComponent
                  isMapCompatible={isMapCompatible}
                  setIsMapCompatible={setIsMapCompatible}
                  event={event}
                  mapContainerRef={mapContainerRef}
                />
              </Box>
            )}
            <Box
              mt='3'
              rounded='xl'
              px='4'
              display={{ base: 'none', md: 'block' }}
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
              py='2'
            >
              <Text color='blackAlpha.500' fontSize='xs'>
                Hosted By
              </Text>
              <Flex mt='2' direction='column' mb='1'>
                <Flex
                  experimental_spaceX='2'
                  align='center'
                  _hover={{ bg: 'blackAlpha.50' }}
                  mx='-4'
                  px='4'
                  py='2'
                  cursor='pointer'
                  transitionDuration='100ms'
                >
                  <BoringAva address={event?.owner} />
                  <Box>
                    {event.owner !==
                    '6M8UEAAqSfDUBqMzxdXxgkTAyXZgKeD6shf1A7dvgnRk' ? (
                      <Text fontSize='14px' w='32'>
                        {ensName
                          ? ensName?.length > 15
                            ? ensName?.slice(0, 6) + '...' + ensName?.slice(-6)
                            : ensName ||
                              event?.owner?.slice(0, 6) +
                                '...' +
                                event?.owner?.slice(-6)
                          : event?.owner?.slice(0, 6) +
                            '...' +
                            event?.owner?.slice(-6)}
                      </Text>
                    ) : (
                      <Text fontSize='14px' w='32'>
                        Abbas
                      </Text>
                    )}
                  </Box>
                </Flex>
              </Flex>
            </Box>
            <Box
              mb={{ base: '40%', md: '0' }}
              mt='3'
              rounded='xl'
              px='4'
              border='1px'
              borderColor='blackAlpha.100'
              boxShadow='0px 3.98227px 87.61px rgba(0, 0, 0, 0.08)'
              py='2'
            >
              <Text color='blackAlpha.500' fontSize='xs'>
                Recent Buyers
              </Text>
              {event?.buyers?.length > 0 ? (
                <AvatarGroup
                  mt='2'
                  size='sm'
                  max={6}
                  fontSize='xs'
                  spacing={-2}
                >
                  {event?.buyers?.reverse().map((data, key) => {
                    let id = key.toString();
                    event?.isSolana === true
                      ? (id = data) // @ts-ignore
                      : (id = data.id);

                    return (
                      <Box _hover={{ zIndex: 10 }} key={key} cursor='pointer'>
                        <BoringAva address={id} key={key} />
                      </Box>
                    );
                  })}
                </AvatarGroup>
              ) : (
                <Text fontSize={13}>You&apos;re the first one here!</Text>
              )}
            </Box>
            {hasTicket && (
              <Flex align='center' justify='space-evenly'>
                {event?.category.event_type == 'Online' ? (
                  <Box
                    p='1.5px'
                    mx='auto'
                    mt='6'
                    transitionDuration='200ms'
                    rounded='full'
                    w='fit-content'
                    boxShadow='0px 5px 33px rgba(0, 0, 0, 0.08)'
                    bg='brand.gradient'
                    _hover={{ transform: 'scale(1.05)' }}
                    _focus={{}}
                    _active={{ transform: 'scale(0.95)' }}
                  >
                    <Button
                      type='submit'
                      rounded='full'
                      bg='white'
                      size='sm'
                      color='blackAlpha.700'
                      fontWeight='medium'
                      _hover={{}}
                      leftIcon={
                        <Box
                          _groupHover={{
                            transform: 'scale(1.1)',
                          }}
                          transitionDuration='200ms'
                        >
                          <Image
                            src='/assets/elements/event_ticket_gradient.svg'
                            w='4'
                            alt='ticket'
                          />
                        </Box>
                      }
                      _focus={{}}
                      _active={{}}
                      onClick={() => {
                        window.open(eventLink, '_blank');
                      }}
                      role='group'
                    >
                      Go to event
                    </Button>
                  </Box>
                ) : null}

                <IconButton
                  p='1.5px'
                  mx='auto'
                  mt='6'
                  icon={<BsCalendarPlus />}
                  role='button'
                  onClick={() => {
                    let eventdate = event?.date;
                    let date = eventdate.split('T')[0];
                    let startDate = eventdate.split('T')[1].split('-')[0];
                    let endDate = eventdate.split('T')[1].split('-')[1];
                    let finalStartDate = moment(
                      date + ' ' + startDate,
                    ).format();

                    let finalEndDate = moment(date + ' ' + endDate).format();

                    let googleStartDate = toGoogleCalDate(
                      new Date(finalStartDate),
                    );
                    let googleEndDate = toGoogleCalDate(new Date(finalEndDate));
                    window.open(
                      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${
                        event?.title
                      }&dates=${googleStartDate}/${googleEndDate}&details=${
                        event?.description.short_desc
                      }&location=${decryptLink(
                        event?.link as string,
                      )}&sf=true&output=xml`,
                      '_blank',
                    );
                  }}
                  aria-label='add to calendar'
                ></IconButton>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
