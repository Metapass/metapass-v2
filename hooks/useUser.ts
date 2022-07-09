import { onAuthStateChanged, User } from 'firebase/auth'
import { useState } from 'react'
import { auth } from '../utils/firebaseUtils'

const useUser = () => {
    const [user, setUser] = useState<User | null>(null)

    onAuthStateChanged(auth, (user) => {
        if (typeof user !== null) {
            setUser(user)
        }
    })

    return { user }
}

export { useUser }
