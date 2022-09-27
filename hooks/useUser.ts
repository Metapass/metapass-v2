import { User } from '@supabase/supabase-js'
import { Web3Auth } from '@web3auth/web3auth'
import { UserInfo } from '@web3auth/base'
import { useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/config/supabaseConfig'
import { walletContext } from '../utils/walletContext'
import { web3Context } from '../utils/web3Context'
export interface OpenLoginUserWithMetadata extends UserInfo {
    user_metadata: {
        name: string
        avatar_url: string
        email: string
    }
}
const useUser = () => {
    const [wallet] = useContext(walletContext)
    const [user, setUser] = useState<
        User | null | undefined | OpenLoginUserWithMetadata
    >(undefined)
    const [web3, setWeb3, web3auth, setWeb3auth] = useContext(web3Context)
    supabase.auth.onAuthStateChange((event, session) => {
        setUser(supabase.auth.user)
    })
    useEffect(() => {
        async function init() {
            // console.log(web3auth, 'web3auth')
            if (!user && web3auth) {
                try {
                    const u = await (web3auth as Web3Auth).getUserInfo()
                    const userwithmetadata = {
                        ...u,
                        user_metadata: {
                            name: u.name,
                            avatar_url: u.profileImage,
                            email: u.email,
                        },
                    }
                    setUser(userwithmetadata as OpenLoginUserWithMetadata)
                    console.log(userwithmetadata, 'userwithmetadata')
                } catch (error) {
                    if (
                        (error as Error).message.includes(
                            'Wallet is not connectedNo wallet is connected'
                        )
                    ) {
                        console.log('Wallet is not connected')
                    } else {
                        console.log(error, 'error')
                    }
                }
            }
        }
        init()
    }, [wallet, wallet.address])
    return { user }
}

export { useUser }
