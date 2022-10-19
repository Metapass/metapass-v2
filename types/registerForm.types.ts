interface Question {
    val: string
    isRequired: boolean
    id: number
}

type customQues = Question[]

interface formType {
    preDefinedQues: Question[]
    customQues: customQues
}

interface formDataType {
    id: number
    data: formType
}
type questionType = 'DROPDOWN' | 'CHECKBOX' | 'INPUT' | 'LONGTEXT'
type options = string[]

interface Questions {
    question: string
    options?: options
    type: questionType
    defaultValue?: string
    required: boolean
}
export type {
    Question,
    customQues,
    formType,
    formDataType,
    Questions,
    questionType,
}
