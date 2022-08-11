import { Button, Checkbox, Flex, Input, Text } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'react-hot-toast'
import { Reorder, useDragControls } from 'framer-motion'
import FormQuestion from '../Elements/FormQuestion.item'
import { Question } from '../../types/registerForm.types'

const CustomQues = ({
    questions,
    setQuestions,
}: {
    questions: Question[]
    setQuestions: Dispatch<SetStateAction<Question[]>>
}) => {
    const [vals, setVals] = useState<Question>({
        val: '',
        isRequired: false,
        id: 0,
    })

    const controls = useDragControls()

    const addQues = (val: Question) => {
        let data = {
            ...val,
            id: questions.length + 1,
        }

        setQuestions([...questions, data])
        setVals({ val: '', isRequired: false, id: 0 })
    }

    const delQues = (q: Question) => {
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
                    {questions.map((q) => (
                        <FormQuestion
                            key={q.id}
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
                        value={vals.val}
                        onChange={(e) =>
                            setVals({ ...vals, val: e.target.value })
                        }
                        isRequired
                    />
                    <Checkbox
                        isChecked={vals.isRequired}
                        onChange={(e) =>
                            setVals({ ...vals, isRequired: e.target.checked })
                        }
                    >
                        Required
                    </Checkbox>
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
