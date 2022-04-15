import type { NextPage } from 'next'
import { useState } from 'react'

import { Box, useDisclosure } from '@chakra-ui/react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import { SignUpModal } from '../../components'

import { auth } from '../../utils/firebaseUtils'
import { onAuthStateChanged } from 'firebase/auth'

const Account: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user, setUser] = useState<any>()

    console.log(user)

    onAuthStateChanged(auth, (user) => {
        user ? setUser(user) : setUser(null)
    })

    return (
        <>
            {!user && (
                <SignUpModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                />
            )}

            <Box>
                <NavigationBar />
            </Box>
        </>
    )
}

export default Account
