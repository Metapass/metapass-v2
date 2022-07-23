import { useForceUpdate } from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import resolveDomains from '../../hooks/useDomain'
import resolveBalance from '../../hooks/useSolBalance'

import { WalletType } from '../../utils/walletContext'

export const ConnectWallet = ({
    children,
    redirectToWelcome,
    noToast,
    setWallet,
    setAddress,
    setBalance,
    setWalletType,
    onClose,
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
    // const [domain] = useDomain('SOL', publicKey?.toBase58()!)
    const router = useRouter()
    // const [balanceState, setBalanceState] = useState(0)

    useEffect(() => {
        async function fetchValues() {
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
                onClose()

                const b = await resolveBalance(publicKey?.toBase58())
                const d = await resolveDomains('SOL', publicKey?.toBase58()!)
                console.log(`User Balance: ${b}`)
                if (!noToast) toast.success('Connected to Solana wallet')
                if (redirectToWelcome) router.push(`/welcome/${publicKey}`)

                if (setAddress) setAddress(publicKey.toString())

                if (setBalance) setBalance(b?.toString())

                if (setWallet)
                    setWallet({
                        address: publicKey.toString(),
                        balance: b?.toString()!,
                        type: 'sol',
                        domain: d?.domain + '.sol' ?? null,
                        chain: 'SOL',
                    })

                if (setWalletType) setWalletType('sol')
            }
        }
        fetchValues()
    }, [SolanaWallet, visible, publicKey, redirectToWelcome, clicked, fire])

    const handleConnect = () => {
        setClicked(true)
        if (SolanaWallet) return
        console.log('Solana Wallet retrieved', SolanaWallet)
        setVisible(true)
    }

    return <div onClick={handleConnect}>{children}</div>
}
