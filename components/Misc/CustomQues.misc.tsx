import { Button, Checkbox, Flex, Input, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'react-hot-toast'
import { Reorder, useDragControls } from 'framer-motion'
import FormQuestion from '../Elements/FormQuestion.item'

interface Question {
    val: string
    isRequired: boolean
}

const CustomQues = () => {
    const [questions, setQuestions] = useState<string[]>([])
    const [vals, setVals] = useState<string>('')

    const controls = useDragControls()

    const addQues = (val: string) => {
        if (questions.indexOf(val) === -1) {
            setQuestions([...questions, val])
            setVals('')
        } else {
            toast.error('Question already exists with the same name')
        }
    }

    const delQues = (q: string) => {
        let newArr = questions.filter((ques) => {
            return ques !== q
        })

        setQuestions(newArr)
        toast.success('Question Deleted')
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
                    py="2"
                >
                    {questions.map((q: string) => (
                        <FormQuestion
                            key={q}
                            q={q}
                            delQues={delQues}
                            controls={controls}
                        />
                    ))}
                </Flex>
            ) : (
                <Text ml="3" fontWeight="regular" color="gray.600">
                    No custom questions added.
                </Text>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    addQues(vals)
                }}
            >
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
                        value={vals}
                        onChange={(e) => setVals(e.target.value)}
                        isRequired
                    />

                    <Button
                        h="8"
                        rounded="full"
                        px="6"
                        colorScheme="green"
                        fontWeight="500"
                        type="submit"
                    >
                        + Add
                    </Button>
                </Flex>
            </form>
        </Flex>
    )
}

export default CustomQues
