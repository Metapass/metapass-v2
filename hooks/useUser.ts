import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from '../lib/config/supabaseConfig'

const useUser = () => {
    const [user, setUser] = useState<User | null | undefined>(undefined)

    supabase.auth.onAuthStateChange((event, session) => {
        setUser(supabase.auth.user)
    })

    return { user }
}

export { useUser }
