interface ModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    address? :string
}

export type { ModalProps }
