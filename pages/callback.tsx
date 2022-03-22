import React, { useEffect } from 'react'
import Router from 'next/router'
import LinkMagic from '../utils/Magic'
import { CircularProgress, Box } from '@chakra-ui/react'

export default function Callback() {
    // const history = useHistory();

    useEffect(() => {
        const { magic, web3, network } = LinkMagic(
            process.env.NEXT_PUBLIC_ENV as string
        )
        // On mount, we try to login with a Magic credential in the URL query.

        try {
            magic.oauth.getRedirectResult().then((result) => {
                console.log(result.magic.userMetadata)
                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem(
                        'user_metadata',
                        JSON.stringify(result.magic.userMetadata)
                    )
                    Router.push('/')
                }

                // console.log(result.magic.userMetadata);
            })
        } catch (e) {
            console.log('e', e)
        }
    }, [])

    return (
        <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            textAlign="center"
            minH="95vh"
        >
            <CircularProgress isIndeterminate color="purple.500" size="3rem" />
        </Box>
    )
}
