import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Text,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Box,
} from '@chakra-ui/react'

import type { NextComponentType, NextPageContext } from 'next'
import type { ModalProps } from '../../types/AuthModal.types'

const RegisterModal: NextComponentType<NextPageContext, {}, ModalProps> = ({
    isOpen,
    onOpen,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius="xl">
                <Box color="brand.black">
                    <Text
                        align="center"
                        color="brand.black400"
                        fontSize="3xl"
                        fontWeight="semibold"
                    >
                        Registration
                    </Text>
                    {/* <ModalCloseButton _focus={{}} /> */}
                    <ModalBody display="flex" justifyContent="center">
                        <Input w="64" />
                    </ModalBody>
                </Box>
            </ModalContent>
        </Modal>
    )
}

export default RegisterModal
