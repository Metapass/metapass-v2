import { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/config/supabaseConfig'

const handleRegister = async (
    user: User | null,
    onOpen: () => void,
    setToOpen: any
) => {
    if (user) {
        setToOpen(false)
        const { data, error } = await supabase
            .from('responses')
            .select('email')
            .eq('email', user?.email)

        data?.length !== 0
            ? toast.error("You've already filled the form")
            : onOpen()
    } else {
        setToOpen(true)
    }
}

export { handleRegister }
