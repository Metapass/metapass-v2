import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'

import type { NextComponentType, NextPageContext } from 'next'
import type { ModalProps } from '../../types/AuthModal.types'

const UpdateProfileModal: NextComponentType<
    NextPageContext,
    {},
    ModalProps
> = ({ isOpen, onOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                {/* <ModalBody>
                </ModalBody> */}

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="ghost">Secondary Action</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export default UpdateProfileModal