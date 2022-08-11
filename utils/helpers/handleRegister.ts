import { User } from '@supabase/supabase-js'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/config/supabaseConfig'
import { walletContext } from '../walletContext'

const handleRegister = async (
    user: User | null,
    onOpen: () => void,
    setToOpen: any,
    event: string,
    wallet: any
) => {
    if (user) {
        setToOpen(false)

        const { data, error } = await supabase
            .from('responses')
            .select('email')
            .eq('address', wallet?.address)
            .eq('event', event)

        data?.length !== 0
            ? toast.error("You've already filled the form")
            : onOpen()
    } else {
        setToOpen(true)
        // toast.error('Please connect your wallet first')
    }
}

export { handleRegister }
