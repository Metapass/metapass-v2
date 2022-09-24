import {
    Modal,
    ModalOverlay,
    Text,
    ModalContent,
    ModalHeader,
    Flex,
    ModalCloseButton,
    ModalBody,
    Divider,
    ModalFooter,
    Box,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    FormControl,
} from '@chakra-ui/react'
import { MdCalendarToday as CalendarToday } from 'react-icons/md'
import { useState } from 'react'

export default function DateModal({ isOpen, onClose, onSubmit }: any) {
    const [startDateTime, setStartDateTime] = useState<string>('')
    const [endTimes, setEndTimes] = useState({
        hh: 0,
        mm: 0,
    })

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent color="brand.black" overflow="hidden" rounded="xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()

                        /* YYYY:MM:DDThh:mm:ss-hh:mm:ss */

                        onSubmit(
                            `${startDateTime.replaceAll('-', ':')}-${
                                endTimes.hh
                            }:${endTimes.mm}:00`
                        )
                        onClose()
                    }}
                >
                    <ModalHeader fontWeight="medium" fontSize="lg">
                        <Flex align="center" experimental_spaceX="2">
                            <CalendarToday fontSize="small" />
                            <Text>Date of Event</Text>
                        </Flex>
                        <ModalCloseButton _focus={{}} />
                    </ModalHeader>
                    <ModalBody>
                        <FormControl isRequired>
                            <Text
                                mb="2"
                                fontSize="xs"
                                ml="1"
                                color="blackAlpha.700"
                            >
                                Starting Date & Time
                            </Text>
                            <Input
                                placeholder="Select Date and Time"
                                size="md"
                                onChange={(e) => {
                                    setStartDateTime(e.target.value)
                                }}
                                type="datetime-local"
                            />
                            <Flex mt={5} gap={4}>
                                <InputGroup size="md">
                                    <Input
                                        onChange={(e) => {
                                            const a =
                                                parseInt(
                                                    startDateTime
                                                        .split('T')[1]
                                                        .split(':')[0]
                                                ) + e.target.valueAsNumber
                                            if (a < 25) {
                                                setEndTimes({
                                                    ...endTimes,
                                                    hh: a,
                                                })
                                            }
                                        }}
                                        type="number"
                                        placeholder="1"
                                    />
                                    <InputRightAddon>Hours</InputRightAddon>
                                </InputGroup>
                                <InputGroup size="md">
                                    <Input
                                        onChange={(e) => {
                                            const a =
                                                parseInt(
                                                    startDateTime
                                                        .split('T')[1]
                                                        .split(':')[1]
                                                ) + e.target.valueAsNumber
                                            if (a < 61) {
                                                setEndTimes({
                                                    ...endTimes,
                                                    mm: a,
                                                })
                                            }
                                        }}
                                        placeholder="00"
                                        type="number"
                                    />
                                    <InputRightAddon>Min</InputRightAddon>
                                </InputGroup>
                            </Flex>
                        </FormControl>
                        <Text fontSize={'xs'} mt={2}>
                            The end time will be {endTimes.hh}:{endTimes.mm}
                        </Text>
                    </ModalBody>
                    <Divider mt="2" />
                    <ModalFooter bg="blackAlpha.50">
                        <Box
                            p="1.5px"
                            transitionDuration="200ms"
                            rounded="full"
                            boxShadow="0px 5px 33px rgba(0, 0, 0, 0.08)"
                            bg="brand.gradient"
                            _hover={{ transform: 'scale(1.05)' }}
                            _focus={{}}
                            _active={{ transform: 'scale(0.95)' }}
                        >
                            <Button
                                type="submit"
                                rounded="full"
                                bg="white"
                                size="sm"
                                color="blackAlpha.700"
                                fontWeight="medium"
                                _hover={{}}
                                _focus={{}}
                                _active={{}}
                                role="group"
                            >
                                Done
                            </Button>
                        </Box>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}
