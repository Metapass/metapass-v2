import { Button, Flex } from '@chakra-ui/react'
import { HiOutlineChevronRight as ChevronRight } from 'react-icons/hi'

const NextStep = () => {
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            mt="10"
            mb="20"
        >
            <Button
                size="lg"
                rounded="full"
                type="submit"
                bg="brand.gradient"
                color="white"
                rightIcon={
                    <Flex
                        justify="center"
                        alignItems="center"
                        transitionDuration="200ms"
                        _groupHover={{ transform: 'translateX(4px)' }}
                    >
                        <ChevronRight />
                    </Flex>
                }
                _hover={{}}
                _focus={{}}
                _active={{}}
                py="7"
                role="group"
                fontWeight="medium"
                px="8"
            >
                Next Step
            </Button>
        </Flex>
    )
}

export default NextStep
