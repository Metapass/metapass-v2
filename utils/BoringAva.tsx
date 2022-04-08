import { Box } from '@chakra-ui/react'
import { default as BoringAvatar } from 'boring-avatars'
export default function BoringAva({ address }: { address: string }) {
    return (
        <Box rounded="full" overflow="hidden" w="fit-content">
            <BoringAvatar
                size="1.7rem"
                name={address || 'address'}
                variant="beam"
                colors={['#FCD8AF', '#FEC49B', '#FE9B91', '#FD6084', '#045071']}
            />
        </Box>
    )
}
