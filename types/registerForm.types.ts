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

export type { Question, customQues, formType }
