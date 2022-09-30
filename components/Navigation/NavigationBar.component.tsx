import {
    Button,
    Flex,
    Image,
    Text,
    Fade,
    Link,
    Box,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Heading,
    Spinner,
} from '@chakra-ui/react'
import { MdAccountBalanceWallet, MdClose } from 'react-icons/md'
import { IoIosAdd, IoIosLogOut } from 'react-icons/io'
import { IoLogIn } from 'react-icons/io5'
import NextLink from 'next/link'
import { Modal } from '@chakra-ui/react'
import { walletContext, WalletType } from '../../utils/walletContext'
import { web3Context } from '../../utils/web3Context'
import { WALLET_ADAPTERS } from '@web3auth/base'
import {
    useState,
    useContext,
    useEffect,
    Dispatch,
    SetStateAction,
} from 'react'

import toast from 'react-hot-toast'

import { HiOutlineChevronDown } from 'react-icons/hi'
import MyEvents from '../../layouts/MyEvents/MyEvents.layout'
const env: any = process.env.NEXT_PUBLIC_ENV === 'prod'
const polygon = require(env
    ? '../../utils/polygon.json'
    : '../../utils/mumbai.json')
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
declare const window: any
import BoringAva from '../../utils/BoringAva'
import { ConnectWallet } from './ConnectWallet'
import {
    useAccount,
    useBalance,
    useConnect,
    useNetwork,
    useSwitchNetwork,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { chain as evmChain } from 'wagmi'
import useMultichainDisconnect from '../../hooks/useMultichainDisconnect'

import { FaBars } from 'react-icons/fa'

import { supabase } from '../../lib/config/supabaseConfig'
import resolveDomains from '../../hooks/useDomain'
import { useRouter } from 'next/router'

import WalletSignUpModal from '../Modals/WalletSignUp.modal'
import { Web3Auth } from '@web3auth/web3auth'

// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers'
import { useUser } from '../../hooks/useUser'
interface Props {
    mode?: string
    isOpen3: boolean
    onClose3: () => void
    onOpen3: () => void
}
export default function NavigationBar({
    mode = 'dark',
    isOpen3,
    onOpen3,
    onClose3,
}: Props) {
    const [address, setAddress] = useState<string>('')

    const [balance, setBalance] = useState<string>('')
    const [isWalletLoading, setIsWalletLoading] = useState<boolean | null>(null)
    const { user: commonUser } = useUser()
    const user = supabase.auth.user() || commonUser

    const [wallet, setWallet] =
        useContext<[WalletType, Dispatch<SetStateAction<WalletType>>]>(
            walletContext
        )

    const [_, setWeb3, web3auth, setWeb3auth]: any = useContext(web3Context)
    const [walletType, setWalletType] = useState<'mm' | 'wc' | 'sol' | null>(
        null
    )
    const { connect: connectMM } = useConnect({
        connector: new InjectedConnector(),
    })
    const { connect: connectWC } = useConnect({
        connector: new WalletConnectConnector({
            chains: [evmChain.polygon, evmChain.polygonMumbai],
            options: {
                qrcode: true,
            },
        }),
    })

    const { chain, chains } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const { address: addy, isConnected } = useAccount()
    const { data } = useBalance({
        addressOrName: addy,
    })
    const { multichainDisconnector } = useMultichainDisconnect(
        wallet.chain,
        wallet.type
    )
    const [domain, setDomain] = useState<string | null>(null)
    const [showMyEvents, setMyEvents] = useState(false)
    const router = useRouter()
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onClose: onClose1,
    } = useDisclosure()
    const {
        isOpen: isOpen2,
        onOpen: onOpen2,
        onClose: onClose2,
    } = useDisclosure()

    const chainid: any = env ? 137 : 80001
    const endpoint: any = env
        ? process.env.NEXT_PUBLIC_ENDPOINT_POLYGON
        : process.env.NEXT_PUBLIC_ENDPOINT_MUMBAI

    const handleMetamask = async () => {
        if (isConnected && addy) {
            const dom = await resolveDomains('POLYGON', addy as string)
            setDomain(dom?.domain ?? null)
            if (chain != env ? evmChain.polygon : evmChain.polygonMumbai) {
                if (switchNetwork) {
                    switchNetwork(env ? 137 : 80001)
                }
            }
            setBalance(data?.formatted as string)
            setAddress(addy as string)
            setWallet({
                balance: data?.formatted as string,
                address: addy as string,
                type: 'mm',
                chain: 'POLYGON',
                domain: null,
            })
        } else {
            connectMM()
            setBalance(data?.formatted as string)
            setAddress(addy as string)
            const dom = await resolveDomains('POLYGON', addy as string)
            setDomain(dom?.domain ?? null)
            setWallet({
                balance: data?.formatted as string,
                address: addy as string,
                type: 'mm',
                chain: 'POLYGON',
                domain: dom?.domain ?? null,
            })
        }
    }
    const handleWalletConnect = async () => {
        if (!isConnected) {
            connectWC()
            const dom = await resolveDomains('POLYGON', addy as string)
            setDomain(dom?.domain ?? null)
        } else {
            if (chain?.id != chainid) {
                toast.error('Please switch to Polygon Mainnet in your Wallet', {
                    position: 'bottom-center',
                    id: 'switch9',
                })
            } else {
                onClose1()
                setWalletType('wc')
            }
        }
    }

    const handleEmail = async () => {
        onClose3()

        setIsWalletLoading(true)
        const web3auth = new Web3Auth({
            clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
            chainConfig: {
                chainNamespace: 'eip155',
                chainId: env ? '0x89' : '0x13881',
                rpcTarget: endpoint,
            },

            uiConfig: {
                theme: 'light',
                loginMethodsOrder: ['google'],
                appLogo:
                    'https://res.cloudinary.com/dev-connect/image/upload/v1664263385/img/mplogocircle_pve27h.png', // Your App Logo Here
            },
        })
        const openloginAdapter = new OpenloginAdapter({
            loginSettings: {
                mfaLevel: 'none',
            },
            adapterSettings: {
                network: 'cyan',
                whiteLabel: {
                    name: 'Metapass',
                    logoLight:
                        'https://res.cloudinary.com/dev-connect/image/upload/v1664263385/img/mplogocircle_pve27h.png',
                },
            },
        })
        web3auth.configureAdapter(openloginAdapter)
        await web3auth.initModal({
            // @ts-ignore
            modalConfig: {
                [WALLET_ADAPTERS.OPENLOGIN]: {
                    label: 'openlogin',

                    loginMethods: {
                        google: {
                            name: 'google login',
                        },
                        facebook: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        reddit: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        discord: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        twitch: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        apple: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        github: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        line: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        wechat: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        weibo: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        kakao: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        linkedin: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                        twitter: {
                            // it will hide the facebook option from the Web3Auth modal.
                            showOnModal: false,
                        },
                    },
                    // setting it to false will hide all social login methods from modal.
                    showOnModal: true,
                },
            },
        })
        // onClose3()

        setWeb3auth(web3auth)
        const web3authProvider = await web3auth.connect()
        // @ts-ignore
        const web3 = new Web3(web3auth.provider)
        setWeb3(web3authProvider)

        const userAccounts = await web3.eth.getAccounts()
        let bal = await web3.eth.getBalance(userAccounts[0])
        setWallet({
            balance: ethers.utils.formatEther(bal),
            address: userAccounts[0],
            type: 'web3auth',
            chain: 'POLYGON',
            domain: null,
        })
        setIsWalletLoading(false)
        toast.success('Welcome', {
            id: 'web3authwallet',
        })
    }

    const mdcontent = [
        {
            title: 'Metamask',
            description: 'Connect to Metamask',
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4=',
            connector: handleMetamask,
        },
        {
            title: 'Wallet Connect',
            description: 'Connect to your wallet',
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+',
            connector: handleWalletConnect,
        },
        {
            title: 'Solana Wallet',
            description: 'Connect any Solana Wallet',
            icon: '/assets/solana-logo.png',
            connector: () => {},
        },
    ]
    useEffect(() => {
        if (isConnected) {
            if (chain?.id != chainid) {
                switchNetwork && switchNetwork(chainid)
            } else {
                setAddress(addy as string)
                setBalance(data?.formatted as string)
                setWallet({
                    balance: data?.formatted as string,
                    address: addy as string,
                    domain: domain,
                    type: walletType,
                    chain: 'POLYGON',
                })
            }
        }
    }, [isConnected, chain])

    const disconnectWallet = async () => {
        if (
            isConnected ||
            window?.solana?.isConnected ||
            window?.solana?.isPhantom ||
            web3auth?.status === 'connected'
        ) {
            await multichainDisconnector()
            setBalance('')
            setAddress('')
            setWallet({
                balance: '',
                address: '',
                type: null,
                domain: '',
                chain: null,
            })
            onClose1()
            setIsWalletLoading(null)
        }
    }

    useEffect(() => {
        if (isOpen1 && wallet.type) {
            const slug =
                wallet.type === 'sol' ? 'Solana Mainnet' : 'Polygon Mainnet'
            toast.success(`Make sure to choose ${slug}`, {
                icon: (
                    <Avatar
                        borderRadius="full"
                        h="100%"
                        w="15%"
                        src={
                            wallet.type === 'sol'
                                ? 'assets/solana-logo.png'
                                : polygon.img
                        }
                    />
                ),
                duration: 4000,
                position: 'bottom-center',
                style: {
                    width: '100%',
                    margin: '0 auto',
                },
            })
        }
    }, [isOpen1, wallet.type])
    useEffect(() => {
        if (isOpen1 && address && address !== '') {
            onClose1()
        }
    }, [address, onClose1, isOpen1])

    return (
        <>
            <Fade
                in={isOpen1}
                transition={{
                    enter: { duration: 5 },
                    exit: { duration: 5 },
                }}
            >
                <MyEvents
                    isOpen={showMyEvents}
                    onClose={() => {
                        setMyEvents(false)
                    }}
                />

                {isOpen3 && (
                    <WalletSignUpModal
                        handleEmail={handleEmail}
                        isOpen={isOpen3}
                        onClose={onClose3}
                        onOpen={onOpen3}
                        onWalletOpen={onOpen1}
                    />
                )}
                {isOpen1 && (
                    <Modal isOpen={isOpen1} onClose={onClose1}>
                        <ModalOverlay />
                        <ModalContent rounded="xl">
                            <ModalBody m={2} p={4}>
                                {mdcontent.map((item, index) => {
                                    return !(index == 2) ? (
                                        <Flex
                                            key={index}
                                            w="full"
                                            flexDirection="column"
                                            alignItems="center"
                                            borderRadius="md"
                                            as="button"
                                            rounded="xl"
                                            _hover={{ bg: 'gray.100' }}
                                            onClick={item.connector}
                                        >
                                            <Flex
                                                justify="space-between"
                                                alignItems="center"
                                                px="4"
                                                py="4"
                                            >
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="medium"
                                                >
                                                    {item.title}
                                                </Text>
                                            </Flex>
                                            <Image
                                                src={item.icon}
                                                alt="icon"
                                                w="10%"
                                            />
                                            <Flex
                                                justify="space-between"
                                                alignItems="center"
                                                px="4"
                                                py="4"
                                            >
                                                <Text
                                                    fontSize="md"
                                                    fontWeight="normal"
                                                    color="gray.400"
                                                >
                                                    {item.description}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    ) : (
                                        <ConnectWallet
                                            key={index}
                                            setWallet={setWallet}
                                            setAddress={setAddress}
                                            setBalance={setBalance}
                                            setWalletType={setWalletType}
                                            onClose={onClose1}
                                            isOpen={isOpen1}
                                            onOpen={onOpen1}
                                        >
                                            <Flex
                                                key={index}
                                                w="full"
                                                flexDirection="column"
                                                alignItems="center"
                                                borderRadius="md"
                                                as="button"
                                                rounded="xl"
                                                _hover={{ bg: 'gray.100' }}
                                            >
                                                <Flex
                                                    justify="space-between"
                                                    alignItems="center"
                                                    px="4"
                                                    py="4"
                                                >
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="medium"
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </Flex>
                                                <Image
                                                    src={item.icon}
                                                    alt="icon"
                                                    w="10%"
                                                />
                                                <Flex
                                                    justify="space-between"
                                                    alignItems="center"
                                                    px="4"
                                                    py="4"
                                                >
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="normal"
                                                        color="gray.400"
                                                    >
                                                        {item.description}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </ConnectWallet>
                                    )
                                })}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )}
            </Fade>
            <Box position="absolute" w="full">
                <Flex
                    borderBottom={mode === 'white' ? '2px' : '0'}
                    bg={mode === 'white' ? 'white' : 'transparent'}
                    borderColor="gray.100"
                    justify="space-between"
                    px={{ base: '6', md: '8' }}
                    position="relative"
                    zIndex={999}
                    maxW="1600px"
                    mx="auto"
                    py={{ base: '4', md: '6' }}
                    alignItems="center"
                    color="white"
                >
                    {' '}
                    <NextLink href="/" passHref>
                        <Link _hover={{}} _focus={{}} _active={{}}>
                            <Image
                                src={
                                    mode === 'white'
                                        ? '/assets/newlogo.svg'
                                        : '/assets/newlogowhite.svg'
                                }
                                alt="Metapass"
                                w={{ base: '10', md: '16' }}
                            />
                        </Link>
                    </NextLink>
                    {wallet.address ? (
                        <Menu>
                            <MenuButton
                                display={{ base: 'block', md: 'none' }}
                                size="md"
                                bg="transparent"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                _focus={{}}
                                _active={{}}
                                as={Button}
                            >
                                <FaBars
                                    color={mode === 'white' ? 'black' : 'white'}
                                />
                            </MenuButton>{' '}
                            <MenuList
                                zIndex={999}
                                display={{ base: 'block', md: 'none' }}
                                shadow="none"
                                bg="white"
                                rounded="lg"
                                border="none"
                                position="relative"
                            >
                                <MenuItem>
                                    <Flex experimental_spaceX="2" align="end">
                                        <Image
                                            src={
                                                wallet.chain === 'SOL'
                                                    ? '/assets/solana-logo.png'
                                                    : '/assets/matic_circle.svg'
                                            }
                                            alt={wallet.chain as string}
                                            w="6"
                                            h="6"
                                            mb="1"
                                        />
                                        <Box>
                                            <Text
                                                fontFamily="body"
                                                fontSize="xs"
                                                fontWeight="thin"
                                                color="blackAlpha.500"
                                            >
                                                Account Balance
                                            </Text>
                                            <Text
                                                mt="-1"
                                                color="brand.black600"
                                                fontFamily="body"
                                                fontSize="lg"
                                                fontWeight="semibold"
                                            >
                                                {wallet.balance?.substring(
                                                    0,
                                                    4
                                                )}{' '}
                                                {wallet.chain === 'POLYGON'
                                                    ? 'MATIC'
                                                    : wallet.chain}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </MenuItem>
                                <MenuDivider color="blackAlpha.200" />
                                <MenuItem onClick={() => setMyEvents(true)}>
                                    <Flex
                                        align="center"
                                        experimental_spaceX="4"
                                    >
                                        <Image
                                            src="/assets/elements/event_ticket_gradient.svg"
                                            alt="myevents"
                                        />
                                        <Text
                                            color="blackAlpha.700"
                                            fontWeight="medium"
                                        >
                                            My Events
                                        </Text>
                                    </Flex>
                                </MenuItem>
                                <MenuDivider color="blackAlpha.200" />
                                <MenuItem
                                    onClick={disconnectWallet}
                                    fontSize="sm"
                                    icon={<IoIosLogOut size="20px" />}
                                    color="red.500"
                                >
                                    Disconnect Wallet
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <>
                            <Button
                                rounded="full"
                                color="white"
                                bg="blackAlpha.500"
                                display={{ base: 'flex', md: 'none' }}
                                border="2px"
                                _hover={{ bg: 'blackAlpha.600' }}
                                _focus={{}}
                                _active={{ bg: 'blackAlpha.700' }}
                                py="4"
                                fontSize="sm"
                                fontWeight="normal"
                                leftIcon={
                                    isWalletLoading ? (
                                        <Spinner size="sm" ml="2" />
                                    ) : undefined
                                }
                                onClick={() => {
                                    disconnectWallet()
                                    onOpen3()
                                }}
                            >
                                {isWalletLoading ? 'Loading' : 'Sign In'}
                            </Button>
                        </>
                    )}
                    <Flex
                        display={{ base: 'none', md: 'flex' }}
                        alignItems="center"
                        experimental_spaceX="6"
                    >
                        <Button
                            onClick={() => {
                                router.push('/create')
                            }}
                            pl="1"
                            rounded="full"
                            bg={
                                mode === 'white'
                                    ? 'blackAlpha.100'
                                    : 'whiteAlpha.800'
                            }
                            color="blackAlpha.700"
                            fontWeight="medium"
                            _hover={{
                                shadow: 'sm',
                                bg:
                                    mode === 'white'
                                        ? 'blackAlpha.50'
                                        : 'white',
                            }}
                            border="2px"
                            borderColor={
                                mode === 'white' ? 'blackAlpha.100' : 'white'
                            }
                            _focus={{}}
                            _active={{ transform: 'scale(0.95)' }}
                            role="group"
                            leftIcon={
                                <Flex
                                    _groupHover={{
                                        transform: 'scale(1.05)',
                                    }}
                                    transitionDuration="200ms"
                                    justify="center"
                                    alignItems="center"
                                    color="white"
                                    bg="brand.gradient"
                                    rounded="full"
                                    p="0.5"
                                >
                                    <IoIosAdd size="25px" />
                                </Flex>
                            }
                        >
                            Create Event
                        </Button>
                        {wallet.address || isWalletLoading ? (
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded="full"
                                    color="white"
                                    bg="blackAlpha.500"
                                    border="2px"
                                    pl="1.5"
                                    _hover={{ bg: 'blackAlpha.600' }}
                                    _focus={{}}
                                    fontWeight="normal"
                                    leftIcon={
                                        isWalletLoading ? (
                                            <Spinner size="sm" ml="2" />
                                        ) : user?.user_metadata?.avatar_url ? (
                                            <Avatar
                                                size="sm"
                                                src={
                                                    user?.user_metadata
                                                        ?.avatar_url
                                                }
                                            />
                                        ) : (
                                            wallet.address && (
                                                <BoringAva
                                                    address={wallet.address}
                                                />
                                            )
                                        )
                                    }
                                    rightIcon={<HiOutlineChevronDown />}
                                >
                                    {isWalletLoading
                                        ? 'Loading'
                                        : wallet.domain ||
                                          wallet?.address?.substring(0, 4) +
                                              '...' +
                                              wallet?.address?.substring(
                                                  wallet?.address?.length - 4
                                              )}
                                </MenuButton>
                                <MenuList
                                    shadow="none"
                                    bg="white"
                                    rounded="lg"
                                    border="none"
                                    position="absolute"
                                >
                                    <MenuItem>
                                        <Flex
                                            experimental_spaceX="2"
                                            align="end"
                                        >
                                            <Image
                                                src={
                                                    wallet.chain === 'SOL'
                                                        ? '/assets/solana-logo.png'
                                                        : '/assets/matic_circle.svg'
                                                }
                                                alt={wallet.chain as string}
                                                w="6"
                                                h="6"
                                                mb="1"
                                            />
                                            <Box>
                                                <Text
                                                    fontFamily="body"
                                                    fontSize="xs"
                                                    fontWeight="thin"
                                                    color="blackAlpha.500"
                                                >
                                                    Account Balance
                                                </Text>
                                                <Text
                                                    mt="-1"
                                                    color="brand.black600"
                                                    fontFamily="body"
                                                    fontSize="lg"
                                                    fontWeight="semibold"
                                                >
                                                    {wallet.balance?.substring(
                                                        0,
                                                        4
                                                    )}{' '}
                                                    {wallet.chain}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </MenuItem>
                                    <MenuDivider color="blackAlpha.200" />
                                    <MenuItem onClick={() => setMyEvents(true)}>
                                        <Flex
                                            align="center"
                                            experimental_spaceX="4"
                                        >
                                            <Image
                                                src="/assets/elements/event_ticket_gradient.svg"
                                                alt="myevents"
                                            />
                                            <Text
                                                color="blackAlpha.700"
                                                fontWeight="medium"
                                            >
                                                My Events
                                            </Text>
                                        </Flex>
                                    </MenuItem>
                                    <MenuDivider color="blackAlpha.200" />
                                    <MenuItem
                                        onClick={disconnectWallet}
                                        fontSize="sm"
                                        icon={<IoIosLogOut size="20px" />}
                                        color="red.500"
                                    >
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <>
                                <Button
                                    rounded="full"
                                    color="white"
                                    bg="blackAlpha.500"
                                    border="2px"
                                    _hover={{ bg: 'blackAlpha.600' }}
                                    _focus={{}}
                                    _active={{ bg: 'blackAlpha.700' }}
                                    py="5"
                                    // minW="40%"
                                    fontWeight="normal"
                                    // leftIcon={
                                    //     <MdAccountBalanceWallet size="25px" />
                                    // }
                                    onClick={() => {
                                        disconnectWallet()
                                        onOpen3()
                                    }}
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
