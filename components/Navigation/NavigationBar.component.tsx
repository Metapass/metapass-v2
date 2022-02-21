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
    ModalCloseButton,
    ModalBody,
    IconButton,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Heading,
} from '@chakra-ui/react'
import { MdAccountBalanceWallet, MdClose } from 'react-icons/md'
import { IoIosAdd, IoIosLogOut } from 'react-icons/io'
import NextLink from 'next/link'
import { Modal } from '@chakra-ui/react'
import { walletContext } from '../../utils/walletContext'
import { web3Context } from '../../utils/web3Context'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useState, useContext, useEffect } from 'react'
import Web3 from 'web3'
import toast from 'react-hot-toast'
// import gravatarUrl from 'gravatar-url'

import {
    HiOutlineChevronDoubleDown,
    HiOutlineChevronDown,
} from 'react-icons/hi'
import MyEvents from '../../layouts/MyEvents/MyEvents.layout'
const env: any = process.env.NEXT_PUBLIC_ENV === 'prod'
const polygon = require(env
    ? '../../utils/polygon.json'
    : '../../utils/mumbai.json')

declare const window: any
import eventOrgs from '../../utils/orgs.json'
import BoringAva from '../../utils/BoringAva'
import { getAllEnsLinked } from '../../utils/resolveEns'
import WaitlistModal from '../Misc/WaitlistModal'

export default function NavigationBar({ mode = 'dark' }) {
    const [address, setAddress] = useState<string>('')
    const [balance, setBalance] = useState<string>('')
    const [wallet, setWallet] = useContext(walletContext)
    const [_, setWeb3] = useContext(web3Context)
    const [walletType, setWalletType] = useState<string>('')
    const {
        isOpen: isOpen1,
        onOpen: onOpen1,
        onClose: onClose1,
    } = useDisclosure()
    const [showMyEvents, setMyEvents] = useState(false)
    const [email, setEmail] = useState('')
    const [ensName, setEnsName] = useState<string>('')
    const chainid: any = env ? 137 : 80001
    const endpoint: any = env
        ? process.env.NEXT_PUBLIC_ENDPOINT_POLYGON
        : process.env.NEXT_PUBLIC_ENDPOINT_MUMBAI
    const web3 = new Web3(endpoint as string)
    let wcProvider: any

    const mdcontent = [
        {
            title: 'Metamask',
            description: 'Connect to Metamask',
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4=',
        },
        {
            title: 'Wallet Connect',
            description: 'Connect to your wallet',
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+',
        },
    ]

    async function getAccountData({ accounts, windowType }: any) {
        try {
            accounts = await windowType.ethereum.request({
                method: 'eth_requestAccounts',
            })
            console.log('got accounts', accounts)
            setAddress(accounts[0])
            let bal = await web3.eth.getBalance(accounts[0])
            let ethBal: any = await web3.utils.fromWei(bal, 'ether')
            setBalance(ethBal)

            setWallet({
                balance: ethBal,
                address: accounts[0],
            })
        } catch (error) {
            console.log(error, 'error')
        }
    }

    async function loadAccounts() {
        console.log('enter')
        let windowType = window
        // console.log(windowType, 'windowType')
        let accounts = await windowType.ethereum.request({
            method: 'eth_requestAccounts',
        })

        // console.log(windowType.ethereum.chainId, 'chainId')

        if (windowType.ethereum.chainId == chainid) {
            setAddress(accounts[0])
            // console.log('got accounts', accounts)
            let bal = await web3.eth.getBalance(accounts[0])
            let ethBal: any = await web3.utils.fromWei(bal, 'ether')
            setBalance(ethBal)
            // console.log('got balance', ethBal)
            setWallet({
                balance: ethBal,
                address: accounts[0],
            })
            // console.log('got wallet', wallet)
            localStorage.setItem('Autoconnect', 'true')
            setWalletType('mm')
        } else {
            try {
                await windowType.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: web3.utils.toHex(chainid as string),
                        },
                    ],
                })
                console.log('switched')
                toast.success('Switched to Polygon Mainnet', {
                    id: 'switched1',
                    position: 'top-center',
                    duration: 3000,
                })
                getAccountData({ accounts, windowType })
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    try {
                        console.log('trying to add chain')
                        await windowType.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [polygon.addData],
                        })
                        getAccountData({ accounts, windowType })
                    } catch (addError) {
                        console.log('Error Adding chain: ', addError)
                    }
                } else {
                    console.log('Error Switching Chains: ', switchError)
                }
            }
        }
    }

    const handleWalletConnect = async () => {
        wcProvider = new WalletConnectProvider({
            rpc: {
                [chainid]: endpoint as string,
            },
        })
        try {
            await wcProvider.enable()
            setWalletType('wc')
            //  Create Web3 instance
            const web3 = new Web3(wcProvider as any)
            window.w3 = web3
            setWeb3(web3)
            let accounts = await web3.eth.getAccounts()
            const connectionChainId = await (
                await web3.eth.getChainId()
            ).toString()

            console.log(connectionChainId, chainid)

            if (connectionChainId == chainid) {
                setAddress(accounts[0])
                console.log('accounts', accounts[0])
                let bal = await web3.eth.getBalance(accounts[0])
                let ethBal: any = await web3.utils.fromWei(bal, 'ether')
                setBalance(ethBal)
                console.log('bal', ethBal)
                setWallet({
                    balance: ethBal,
                    address: accounts[0],
                })
                console.log('wallet', wallet)
            } else {
                toast.error('Please switch to Polygon Mainnet here', {
                    position: 'bottom-center',
                    id: 'switch9',
                })
            }
        } catch (e) {
            console.log('User closed modal')
        }
    }
    const disconnectMetaMask = async () => {
        let windowType = window
        const isconnected = await web3.eth.net.isListening()
        if (isconnected && web3) {
            setBalance('')
            setAddress('')
            setWallet({
                balance: '',
                address: '',
            })
            windowType.ethereum.on('accountsChanged', async () => {
                onClose1()
            })
        }
    }

    const disconnectWc = async () => {
        // Close provider session
        const wcProvider = new WalletConnectProvider({
            rpc: {
                [chainid]: endpoint as string,
            },
        })
        setBalance('')
        setAddress('')
        setWallet({
            balance: '',
            address: '',
        })
        const isconnected = wcProvider.isWalletConnect
        if (isconnected) {
            await wcProvider.disconnect()
            wcProvider.on('disconnect', (code: number, reason: string) => {
                onClose1()
                console.log(code, reason)
            })
        }
    }

    useEffect(() => {
        if (isOpen1) {
            toast.success('Make sure to choose Polygon network', {
                icon: (
                    <Avatar
                        borderRadius="full"
                        h="100%"
                        w="17%"
                        src={polygon.img}
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
    }, [isOpen1])

    useEffect(() => {
        if (isOpen1 && address && address !== '') {
            onClose1()
        }
    }, [address, onClose1, isOpen1])

    useEffect(() => {
        if (wcProvider) {
            wcProvider.on('chainChanged', (chainId: number) => {
                if (
                    String(chainId) !== web3.utils.toHex(chainid as string) &&
                    walletType === 'wc'
                ) {
                    toast.error('Please switch to Polygon Mainnet', {
                        id: 'switched6',
                    })
                }
            })
        }
        let windowType = window
        if (walletType === 'mm') {
            windowType.ethereum.on('chainChanged', async (chainId: number) => {
                if (
                    String(chainId) !== web3.utils.toHex(chainid as string) &&
                    walletType === 'mm'
                ) {
                    console.log(chainId, 'chainId')
                    toast.error('Please switch to Polygon Mainnet', {
                        id: 'switched1',
                        position: 'top-center',
                        duration: Infinity,
                    })
                }
                loadAccounts()
            })
        }
        //   dothis()
    }, [walletType, wcProvider, chainid, web3.utils])

    useEffect(() => {
        let confirmation = localStorage.getItem('Autoconnect')
        if (confirmation === 'true') {
            loadAccounts()
        }
    }, [])
    useEffect(() => {
        getAllEnsLinked(wallet.address || address || 'address')
            .then((data) => {
                if (data?.data?.domains && data && data?.data) {
                    console.log(data?.data?.domains)
                    console.log(
                        data?.data.domains?.length,
                        data.data.domains?.length > 0 &&
                            data?.data?.domains[0]?.name
                    )
                    const ens_name =
                        data?.data?.domains?.length > 0 &&
                        data?.data?.domains[0].name
                    setEnsName(ens_name)
                    setWallet({
                        balance: balance,
                        address: address,
                        ens: ens_name,
                    })
                    // console.log(wallet,ens_name)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(wallet)
    }, [address, wallet.address])

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
                <Modal isOpen={isOpen1} onClose={onClose1}>
                    <ModalOverlay />
                    <ModalContent rounded="xl">
                        <ModalBody m={2} p={4}>
                            {mdcontent.map((item: any, index: number) => {
                                return (
                                    <Flex
                                        key={index}
                                        flexDirection="column"
                                        alignItems="center"
                                        borderRadius="md"
                                        as="button"
                                        rounded="xl"
                                        _hover={{ bg: 'gray.100' }}
                                        onClick={
                                            index == 1
                                                ? handleWalletConnect
                                                : loadAccounts
                                        }
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
                                )
                            })}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Fade>
            <Flex
                borderBottom={mode === 'white' ? '2px' : '0'}
                bg={mode === 'white' ? 'white' : 'transparent'}
                borderColor="gray.100"
                justify="space-between"
                px={{ base: '6', md: '8' }}
                position="relative"
                zIndex={9}
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
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="center"
                    experimental_spaceX="6"
                >
                    {eventOrgs.eventOrgs.includes(String(wallet?.address)) ? (
                        <NextLink href="/create" passHref>
                            <Link _hover={{}} _focus={{}} _active={{}}>
                                <Button
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
                                        mode === 'white'
                                            ? 'blackAlpha.100'
                                            : 'white'
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
                            </Link>
                        </NextLink>
                    ) : (
                        <WaitlistModal
                            email={email}
                            setEmail={setEmail}
                            mode={mode}
                        />
                    )}
                    {wallet.address ? (
                        <Menu>
                            <MenuButton>
                                <Button
                                    rounded="full"
                                    color="white"
                                    bg="blackAlpha.500"
                                    border="2px"
                                    pl="1.5"
                                    _hover={{ bg: 'blackAlpha.600' }}
                                    _focus={{}}
                                    // _active={{ bg: "blackAlpha.700" }}

                                    fontWeight="normal"
                                    leftIcon={
                                        <BoringAva address={wallet.address} />
                                    }
                                    rightIcon={<HiOutlineChevronDown />}
                                >
                                    {ensName ||
                                        wallet.address.substring(0, 4) +
                                            '...' +
                                            wallet.address.substring(
                                                wallet.address.length - 4
                                            )}
                                </Button>
                            </MenuButton>
                            <MenuList
                                shadow="none"
                                bg="white"
                                rounded="lg"
                                border="none"
                                position="relative"
                            >
                                <MenuItem>
                                    <Flex experimental_spaceX="2" align="end">
                                        <Image
                                            src="/assets/matic_circle.svg"
                                            alt="matic"
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
                                                {wallet.balance.substring(0, 4)}{' '}
                                                MATIC
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
                                    onClick={
                                        walletType === 'wc'
                                            ? disconnectWc
                                            : disconnectMetaMask
                                    }
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
                                border="2px"
                                _hover={{ bg: 'blackAlpha.600' }}
                                _focus={{}}
                                _active={{ bg: 'blackAlpha.700' }}
                                py="5"
                                fontWeight="normal"
                                leftIcon={
                                    <MdAccountBalanceWallet size="25px" />
                                }
                                onClick={() => {
                                    onOpen1()

                                    console.log(isOpen1)
                                }}
                            >
                                Connect Wallet
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        </>
    )
}
