import { Flex, Badge, Box, Text } from '@chakra-ui/react'
import { BsFillPersonFill } from 'react-icons/bs'

const RequiredQues = () => {
    return (
        <Flex direction="column" gap="2" fontWeight="medium">
            <Flex fontSize="xl" fontWeight="medium" alignItems="center" gap="1">
                <BsFillPersonFill size={22} /> Identity
            </Flex>

            <Flex w="60%" justifyContent="space-between" ml="3">
                <Text textColor="gray.600">Name</Text>

                <Badge
                    display="grid"
                    placeItems="center"
                    px="3"
                    rounded="full"
                    colorScheme="purple"
                >
                    Required
                </Badge>
            </Flex>

            <Flex w="60%" justifyContent="space-between" ml="3">
                <Text textColor="gray.600">Email Address</Text>

                <Badge
                    display="grid"
                    placeItems="center"
                    px="3"
                    rounded="full"
                    colorScheme="purple"
                >
                    Required
                </Badge>
            </Flex>

            <Flex w="60%" justifyContent="space-between" ml="3">
                <Text textColor="gray.600">Wallet Address</Text>

                <Badge
                    display="grid"
                    placeItems="center"
                    px="3"
                    rounded="full"
                    colorScheme="purple"
                >
                    Required
                </Badge>
            </Flex>
        </Flex>
    )
}

export default RequiredQues
