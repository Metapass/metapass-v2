import { Flex, Badge, Box, Text } from '@chakra-ui/react'
import { BsFillPersonFill } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import { formDetails } from '../../lib/recoil/atoms'

const RequiredQues = () => {
    const formData = useRecoilValue(formDetails)
    return (
        <Flex direction="column" gap="2" fontWeight="medium">
            <Flex fontSize="xl" fontWeight="medium" alignItems="center" gap="1">
                <BsFillPersonFill size={22} /> Identity
            </Flex>
            {formData?.preDefinedQues.map((ques) => (
                <Flex
                    w="60%"
                    justifyContent="space-between"
                    ml="3"
                    key={ques.id}
                >
                    <Text textColor="gray.600">{ques.val}</Text>

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
            ))}
        </Flex>
    )
}

export default RequiredQues
