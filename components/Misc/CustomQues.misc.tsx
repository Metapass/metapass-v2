import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'react-hot-toast'
import { AiTwotoneDelete } from 'react-icons/ai'
import { Reorder, useDragControls } from 'framer-motion'
import { TbDragDrop } from 'react-icons/tb'

const CustomQues = () => {
    const [questions, setQuestions] = useState<string[]>([])
    const [val, setVal] = useState<string>()

    const controls = useDragControls()

    const addQues = (val: string) => {
        if (val !== '' && val !== undefined) {
            if (questions.indexOf(val) === -1) {
                setQuestions([...questions, val])
                setVal('')
            } else {
                toast.error('Value already added')
            }
        } else {
            toast.error('Put in some value first')
        }
    }

    return (
        <Flex direction="column" gap="2" fontWeight="medium">
            <Flex fontSize="xl" fontWeight="medium" alignItems="center" gap="1">
                <TbEdit size={22} /> Custom Questions
            </Flex>

            {questions.length !== 0 ? (
                <Flex
                    axis="y"
                    values={questions}
                    onReorder={setQuestions}
                    direction="column"
                    gap="3"
                    px="6"
                    mx="3"
                    as={Reorder.Group}
                >
                    {questions.map((q) => (
                        <Flex
                            alignItems="center"
                            gap="3"
                            w="full"
                            as={Reorder.Item}
                            value={q}
                            key={q}
                            id={q}
                        >
                            <TbDragDrop
                                onPointerDown={(event) => controls.start(event)}
                                size={23}
                            />
                            <Input variant="filled" value={q} readOnly />

                            <AiTwotoneDelete size={25} />
                        </Flex>
                    ))}
                </Flex>
            ) : (
                <Text ml="3" fontWeight="regular" color="gray.600">
                    No custom questions added.
                </Text>
            )}
            <Flex
                px="6"
                py="4"
                rounded="lg"
                mx="3"
                my="1"
                gap="3"
                alignItems="center"
            >
                <Input
                    placeholder="Example Question"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                />

                <Button
                    h="8"
                    rounded="full"
                    px="6"
                    colorScheme="green"
                    fontWeight="500"
                    onClick={() => addQues(val as string)}
                >
                    + Add
                </Button>
            </Flex>
        </Flex>
    )
}

export default CustomQues
