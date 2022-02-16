import { default as BoringAvatar } from 'boring-avatars'
export default function BoringAva({ address }: { address: string }) {
    return (
        <BoringAvatar
            size="1.7rem"
            name={address || "0x23302DA41ae4A69875321343D7ACA464a4E72DB2"}
            variant="beam"
            colors={['#FCD8AF', '#FEC49B', '#FE9B91', '#FD6084', '#045071']}
        />
    )
}
