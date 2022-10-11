interface Question {
  val: string;
  isRequired: boolean;
  id: number;
}

type customQues = Question[];

interface formType {
  preDefinedQues: Question[];
  customQues: customQues;
}

interface formDataType {
  id: number;
  data: formType;
}

export type { Question, customQues, formType, formDataType };
