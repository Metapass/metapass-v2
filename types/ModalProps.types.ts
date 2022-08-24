import { Event } from './Event.type'

interface ModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    event?: Event
    isInviteOnly: boolean
    isResponseOn?: boolean
    formData?: any
    setData?: any
    buyPolygonTicket?: any
    buySolanaTicket?: any
}

export type { ModalProps }
