import {
    Modal,
    ModalOverlay,
    Text,
    ModalContent,
    ModalHeader,
    Flex,
    ModalCloseButton,
    ModalBody,
    Select,
    Divider,
    ModalFooter,
    Box,
    Button,
} from '@chakra-ui/react'
import { MdCalendarToday as CalendarToday } from 'react-icons/md'
import { useState } from 'react'
import twoDigit from 'two-digit'
// import { CalendarToday } from '@mui/icons-material';

export default function DateModal({ isOpen, onClose, onSubmit }: any) {
    const [date, setDate] = useState({
        date: 0,
        month: 0,
        year: 0,
    })

    const [startTime, setStartTime] = useState({
        hh: 1,
        mm: 0,
        ss: 0,
        meridian: 'AM',
    })
    const [endTime, setEndTime] = useState({
        hh: 1,
        mm: 0,
        ss: 0,
        meridian: 'AM',
    })

    function range(start: number, end: number, skip = 1) {
        let k = []
        for (let i = start; i <= end; i += skip) {
            k.push(i)
        }
        return k
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent color="brand.black" overflow="hidden" rounded="xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()

                        let starttime = ''
                        let endtime = ''

                        if (startTime.meridian === 'PM') {
                            starttime = `${twoDigit(
                                startTime.hh + 12
                            )}:${twoDigit(startTime.mm)}:${twoDigit(
                                startTime.ss
                            )}`
                        } else {
                            starttime = `${twoDigit(startTime.hh)}:${twoDigit(
                                startTime.mm
                            )}:${twoDigit(startTime.ss)}`
                        }

                        if (endTime.meridian === 'PM') {
                            endtime = `${twoDigit(endTime.hh + 12)}:${twoDigit(
                                endTime.mm
                            )}:${twoDigit(endTime.ss)}`
                        } else {
                            endtime = `${twoDigit(endTime.hh)}:${twoDigit(
                                endTime.mm
                            )}:${twoDigit(endTime.ss)}`
                        }

                        /* YYYY:MM:DDThh:mm:ss-hh:mm:ss */
                        onSubmit(
                            `${date.year}-${twoDigit(
                                date.month + 1
                            )}-${twoDigit(date.date)}T${starttime}-${endtime}`
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
                        <Flex experimental_spaceX="2">
                            <Select
                                placeholder="Day"
                                required
                                onChange={(e) => {
                                    setDate({
                                        ...date,
                                        date: Number(e.target.value),
                                    })
                                }}
                            >
                                {range(1, 31).map((data, key) => (
                                    <option key={key} value={data}>
                                        {data}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Month"
                                minW="160px"
                                required
                                onChange={(e) => {
                                    setDate({
                                        ...date,
                                        month: Number(e.target.value),
                                    })
                                }}
                            >
                                {[
                                    'January',
                                    'February',
                                    'March',
                                    'April',
                                    'May',
                                    'June',
                                    'July',
                                    'August',
                                    'September',
                                    'October',
                                    'November',
                                    'December',
                                ].map((data, key) => (
                                    <option key={key} value={key}>
                                        {data}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Year"
                                required
                                onChange={(e) => {
                                    setDate({
                                        ...date,
                                        year: Number(e.target.value),
                                    })
                                }}
                            >
                                {range(
                                    new Date().getFullYear(),
                                    new Date().getFullYear() + 1
                                ).map((data, key) => (
                                    <option key={key} value={data}>
                                        {data}
                                    </option>
                                ))}
                            </Select>
                        </Flex>
                        <Box mt="4">
                            <Text
                                mb="2"
                                fontSize="xs"
                                ml="1"
                                color="blackAlpha.700"
                            >
                                Starting time
                            </Text>
                            <Flex experimental_spaceX="2">
                                <Select
                                    placeholder="Hour"
                                    required
                                    onChange={(e) => {
                                        setStartTime({
                                            ...startTime,
                                            hh: Number(
                                                twoDigit(e.target.value)
                                            ),
                                        })
                                    }}
                                >
                                    {range(1, 12).map((data, key) => (
                                        <option key={key} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Minute"
                                    minW="160px"
                                    required
                                    onChange={(e) => {
                                        setStartTime({
                                            ...startTime,
                                            mm: Number(
                                                twoDigit(e.target.value)
                                            ),
                                        })
                                    }}
                                >
                                    {range(0, 59, 5).map((data, key) => (
                                        <option key={key} value={key}>
                                            {twoDigit(data)}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    required
                                    onChange={(e) => {
                                        setStartTime({
                                            ...startTime,
                                            meridian: e.target.value,
                                        })
                                    }}
                                >
                                    {['AM', 'PM'].map((data, key) => (
                                        <option key={key} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </Select>
                            </Flex>
                        </Box>
                        <Box mt="4">
                            <Text
                                mb="2"
                                fontSize="xs"
                                ml="1"
                                color="blackAlpha.700"
                            >
                                Ending time
                            </Text>
                            <Flex experimental_spaceX="2">
                                <Select
                                    placeholder="Hour"
                                    required
                                    onChange={(e) => {
                                        setEndTime({
                                            ...endTime,
                                            hh: Number(
                                                twoDigit(e.target.value)
                                            ),
                                        })
                                    }}
                                >
                                    {range(1, 12).map((data, key) => (
                                        <option key={key} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Minute"
                                    minW="160px"
                                    required
                                    onChange={(e) => {
                                        setEndTime({
                                            ...endTime,
                                            mm: Number(
                                                twoDigit(e.target.value)
                                            ),
                                        })
                                    }}
                                >
                                    {range(0, 59, 5).map((data, key) => (
                                        <option key={key} value={key}>
                                            {twoDigit(data)}
                                        </option>
                                    ))}
                                </Select>
                                <Select
                                    required
                                    onChange={(e) => {
                                        setEndTime({
                                            ...endTime,
                                            meridian: e.target.value,
                                        })
                                    }}
                                >
                                    {['AM', 'PM'].map((data, key) => (
                                        <option key={key} value={data}>
                                            {data}
                                        </option>
                                    ))}
                                </Select>
                            </Flex>
                        </Box>
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
