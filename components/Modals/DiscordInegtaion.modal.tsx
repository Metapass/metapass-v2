import {
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    Button,
    Select,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/config/supabaseConfig'
import { ModalProps } from '../../types/ModalProps.types'

const DiscordModal = ({ isOpen, onOpen, onClose }: ModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />

            <ModalContent
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                as={motion.div}
                initial={{
                    opacity: 0,
                    y: -200,
                }}
            >
                <Flex justify="center">
                    <Image
                        src="/assets/bolt.svg"
                        maxH="28"
                        maxW="28"
                        pos="absolute"
                        zIndex="overlay"
                        top="-14"
                        alt="bolt"
                    />
                </Flex>
                <ModalHeader textAlign="center" mt="10">
                    Update Discord Integration
                </ModalHeader>
                <ModalCloseButton _focus={{}} />

                <ModalBody
                    display="flex"
                    flexDir="column"
                    justifyContent="center"
                    alignItems="center"
                    gap="3"
                >
                    <Button>Connect Discord Account</Button>

                    <Select placeholder="Select your Server"></Select>
                    <Select placeholder="Select desired Role"></Select>

                    <Button>Update Integration</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default DiscordModal
