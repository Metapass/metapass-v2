import { default as BoringAvatar } from 'boring-avatars'
export default function BoringAva({ address }: { address: string }) {
    return (
        <BoringAvatar
            size="1.7rem"
            name={address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}
            variant="beam"
            colors={['#FCD8AF', '#FEC49B', '#FE9B91', '#FD6084', '#045071']}
        />
    )
}
