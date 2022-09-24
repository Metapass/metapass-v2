import {
    Box,
    Button,
    Checkbox,
    Flex,
    Input,
    Select,
    Text,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction, useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { toast } from 'react-hot-toast'
import { Reorder, useDragControls } from 'framer-motion'
import FormQuestion from '../Elements/FormQuestion.item'
import { Question } from '../../types/registerForm.types'
import { type } from 'os'

type quesType = 'DROPDOWN' | 'CHECKBOX'
type DropDownType = {
    type: quesType
    question: string
    options?: string[]
    requird: boolean
    id: number
}

const CustomQues = ({
    questions,
    setQuestions,
    dropDownQuestion,
    setdropDownQuestion,
}: {
    questions: Question[]
    setQuestions: Dispatch<SetStateAction<Question[]>>
    dropDownQuestion: any[]
    setdropDownQuestion: Dispatch<SetStateAction<any[]>>
}) => {
    const [quesType, setQuesType] = useState<quesType>('DROPDOWN')
    const [option, setOption] = useState<string>('')
    const [optionAll, setOptionAll] = useState<string[]>([])
    const [DropDownQuestion, setDropDownQuestion] = useState<DropDownType>({
        id: 0,
        question: '',
        type: 'DROPDOWN',
        requird: false,
    })
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
    const addDropDown = (q: any, options: any) => {
        let data = {
            ...q,
            option: options,
            id: dropDownQuestion.length + 1,
        }
        setdropDownQuestion([...dropDownQuestion, data])
        setDropDownQuestion({
            id: 0,
            question: '',
            type: 'DROPDOWN',
            requird: false,
            options: [],
        })
        setOptionAll([])
    }
    console.log(dropDownQuestion)
    const addCheckBox = (q: any) => {
        let data = {
            ...q,
            type: 'CHECKBOX',
            id: dropDownQuestion.length + 1,
        }
        setdropDownQuestion([...dropDownQuestion, data])
        setDropDownQuestion({
            id: 0,
            question: '',
            type: 'DROPDOWN',
            requird: false,
        })
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
                dropDownQuestion.length === 0 && (
                    <Text ml="3" fontWeight="regular" color="gray.600">
                        No custom questions added.
                    </Text>
                )
            )}
            {dropDownQuestion.length > 0 && (
                <Flex
                    axis="y"
                    values={dropDownQuestion}
                    onReorder={setdropDownQuestion}
                    direction="column"
                    gap="3"
                    px="6"
                    mx="3"
                    as={Reorder.Group}
                    py="2"
                >
                    {dropDownQuestion.map((q) => (
                        <Input
                            key={q.id}
                            variant="filled"
                            value={q.question}
                            readOnly
                        />
                    ))}
                </Flex>
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
            <Select
                mx="9"
                w={'10rem'}
                onChange={(e) => setQuesType(e.target.value as quesType)}
            >
                <option value={'DROPDOWN'}>Dropdown</option>
                <option value={'CHECKBOX'}>Checkbox</option>
            </Select>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    if (quesType === 'DROPDOWN') {
                        addDropDown(DropDownQuestion, optionAll)
                    } else {
                        addCheckBox(DropDownQuestion)
                    }
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
                    {quesType === 'DROPDOWN' && (
                        <>
                            <Input
                                placeholder="Example Question For Drop Down"
                                onChange={(e) => {
                                    setDropDownQuestion({
                                        ...DropDownQuestion,
                                        question: e.target.value,
                                    })
                                }}
                            />
                        </>
                    )}

                    {quesType === 'CHECKBOX' && (
                        <Input
                            onChange={(e) => {
                                setDropDownQuestion({
                                    ...DropDownQuestion,
                                    type: 'CHECKBOX',
                                    question: e.target.value,
                                })
                            }}
                            placeholder="Example Question For Check Box"
                        />
                    )}
                    <Checkbox
                        isChecked={DropDownQuestion.requird}
                        onChange={(e) => {
                            setDropDownQuestion({
                                ...DropDownQuestion,
                                requird: e.target.checked,
                            })
                        }}
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
                {quesType === 'DROPDOWN' &&
                    optionAll?.map((r) => {
                        return (
                            <>
                                <Box my={3}>
                                    <Input
                                        w={'93%'}
                                        mx={9}
                                        variant="filled"
                                        value={r}
                                        readOnly
                                    />
                                </Box>
                            </>
                        )
                    })}
                {quesType === 'DROPDOWN' && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
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
                                placeholder="Add Options"
                                onChange={(e) => {
                                    setOption(e.target.value)
                                }}
                                value={option}
                                isRequired
                            />
                            <Button
                                h="8"
                                rounded="full"
                                px="6"
                                colorScheme="green"
                                fontWeight="500"
                                onClick={() => {
                                    setOptionAll([...optionAll, option])
                                    setOption('')
                                }}
                            >
                                + Add
                            </Button>
                        </Flex>
                    </form>
                )}
            </form>
        </Flex>
    )
}

export default CustomQues
