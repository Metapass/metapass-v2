import { Box, Text } from '@chakra-ui/react'
import { useState } from 'react'
import RequiredQues from '../../components/Misc/RequiredQues.misc'
import NextStep from '../../components/Buttons/NextStep.button'
import CustomQues from '../../components/Misc/CustomQues.misc'

export default function Step2({
    event,
    onSubmit,
}: {
    onSubmit: Function
    event: any
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
            }}
        >
            <Box color="brand.black">
                <Text
                    align="center"
                    color="brand.black400"
                    fontSize="4xl"
                    fontWeight="semibold"
                    mt="4"
                >
                    Customize Register Form
                </Text>

                <Text align="center" color="gray.500" fontSize="lg">
                    These questions will be asked to guests when they register
                    for the event.
                </Text>

                <Box
                    w="full"
                    px="64"
                    display="flex"
                    justifyContent="center"
                    my="10"
                >
                    <Box
                        py="6"
                        w="full"
                        border="dashed 1px"
                        borderColor="gray.300"
                        rounded="lg"
                        px="8"
                        gap="6"
                        display="flex"
                        flexDir="column"
                    >
                        <RequiredQues />
                        <Box w="full" h="1px" bg="gray.300" m="auto" />
                        <CustomQues />
                    </Box>
                </Box>
                <NextStep />
            </Box>
        </form>
    )
}
