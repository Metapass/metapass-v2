import { useForceUpdate } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDomain } from '../../hooks/useDomain'
import useUserSOLBalanceStore from '../../utils/useUserSOLBalanceStore'
import { WalletType } from '../../utils/walletContext'

export const ConnectWallet = ({
    children,
    noFullSize,
    redirectToWelcome,
    noToast,
    setWallet,
    setAddress,
    setBalance,
    setWalletType,
    onClose,
    isOpen,
    onOpen,
}: {
    children: React.ReactNode
    noFullSize?: boolean
    redirectToWelcome?: boolean
    noToast?: boolean
    setWallet: Dispatch<SetStateAction<WalletType>>
    setAddress: any
    setBalance: any
    setWalletType: any
    onClose: () => void
    isOpen: boolean
    onOpen: () => void
}) => {
    const { wallet: SolanaWallet, connect, publicKey } = useWallet()
    const { visible, setVisible } = useWalletModal()
    const [clicked, setClicked] = useState(false)
    const [fire, setFire] = useState(false)
    // console.log('p', publicKey.toBase58())
    // const [domain] = useDomain('SOL', publicKey?.toString() || null)
    let domain: any = null
    console.log(domain)
    const router = useRouter()
    // const test = useWa
    const balance = useUserSOLBalanceStore((s) => s.balance)

    useEffect(() => {
        console.log(domain)
        const req =
            !publicKey &&
            SolanaWallet &&
            SolanaWallet.readyState === 'Installed' &&
            clicked
        if (req) {
            try {
                connect()
            } catch (e) {
                console.error(e)
            }
            return
        }
        if (publicKey) {
            console.log(`User Public Key: ${publicKey}`, domain)

            if (!noToast) toast.success('Connected to Solana wallet')
            if (redirectToWelcome) router.push(`/welcome/${publicKey}`)

            if (setAddress) setAddress(publicKey.toString())

            if (setBalance) setBalance(balance.toString())

            if (setWallet)
                setWallet({
                    address: publicKey.toString(),
                    balance: balance.toString(),
                    type: 'sol',
                    domain: domain ?? null,
                    chain: 'SOL',
                })

            if (setWalletType) setWalletType('sol')
            onClose()
        }
    }, [
        SolanaWallet,
        visible,
        publicKey,
        redirectToWelcome,
        clicked,
        fire,
        domain,
    ])

    const handleConnect = () => {
        setClicked(true)
        if (SolanaWallet) return
        console.log('Solana Wallet retrieved', SolanaWallet, domain)
        setVisible(true)
    }

    return <div onClick={handleConnect}>{children}</div>
}
