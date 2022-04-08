import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);
const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

