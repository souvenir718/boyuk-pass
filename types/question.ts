export type QuestionType = "multiple" | "ox" | "short"

export interface Question {
  id: number
  type?: QuestionType
  title: string
  details: string[]
  answer: number | string
  explanation?: string
}

export interface QuizResult {
  questionId: number
  selectedIndex: number | null
  isCorrect: boolean
}
