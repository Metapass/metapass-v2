import { Event } from './Event.type'

interface ModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    event?: Event
    express?: boolean
}

export type { ModalProps }
