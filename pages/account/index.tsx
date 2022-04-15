import type { NextPage } from 'next'

import { Box, useDisclosure } from '@chakra-ui/react'
import NavigationBar from '../../components/Navigation/NavigationBar.component'
import { SignUpModal } from '../../components'

const Account: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <SignUpModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

            <Box>
                <NavigationBar />
            </Box>
        </>
    )
}

export default Account
