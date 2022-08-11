import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
} from '@chakra-ui/react'

import type { NextComponentType, NextPageContext } from 'next'
import type { ModalProps } from '../../types/ModalProps.types'

const UpdateProfileModal: NextComponentType<
    NextPageContext,
    {},
    ModalProps
> = ({ isOpen, onOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Update Profile</ModalHeader>
                <ModalCloseButton _focus={{}} />
                <ModalBody display="flex" justifyContent="center">
                    <Input w="64" />
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default UpdateProfileModal
