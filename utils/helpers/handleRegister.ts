import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/config/supabaseConfig'

const handleRegister = async (
    user: User | null,
    onOpen: () => void,
    setToOpen: any,
    event: string,
    isConnected?: boolean
) => {
    if (isConnected) {
        if (user) {
            setToOpen(false)

            const { data, error } = await supabase
                .from('responses')
                .select('email')
                .eq('email', user?.email)
                .eq('event', event)

            data?.length !== 0
                ? toast.error("You've already filled the form")
                : onOpen()
        } else {
            setToOpen(true)
             toast.error('Please connect your Polygon wallet')
        }
    } else {
    }
}

export { handleRegister }
