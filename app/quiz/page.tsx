"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import rawQuestions from "@/data/questions.json"
import { Question, QuizResult } from "@/types/question"
import { shuffleArray } from "@/lib/utils"
import QuestionCard from "@/components/QuestionCard"
import ProgressBar from "@/components/ProgressBar"

const allQuestions = rawQuestions as Question[]

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWrongMode = searchParams.get("mode") === "wrong"
  const isBrowseMode = searchParams.get("mode") === "browse"

  const [shuffled, setShuffled] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [done, setDone] = useState(false)
  const [clearedCount, setClearedCount] = useState(0)

  useEffect(() => {
    if (isBrowseMode) {
      const sorted = [...allQuestions].sort((a, b) => a.id - b.id)
      setShuffled(sorted)
    } else if (isWrongMode) {
      const wrongIds = JSON.parse(localStorage.getItem("wrongQuestionIds") || "[]") as number[]
      const wrongQuestions = allQuestions.filter((q) => wrongIds.includes(q.id))
      setShuffled(shuffleArray(wrongQuestions))
    } else {
      setShuffled(shuffleArray(allQuestions))
    }
  }, [isWrongMode, isBrowseMode])

  if (shuffled.length === 0) return null

  function handleNext(isCorrect: boolean) {
    if (isBrowseMode) {
      if (current + 1 >= shuffled.length) {
        router.push("/")
      } else {
        setCurrent((c) => c + 1)
      }
      return
    }

    const q = shuffled[current]
    const newResults = [...results, { questionId: q.id, selectedIndex: null, isCorrect }]
    setResults(newResults)

    const prev = JSON.parse(localStorage.getItem("wrongQuestionIds") || "[]") as number[]
    if (!isWrongMode) {
      if (!isCorrect) {
        const merged = Array.from(new Set([...prev, q.id]))
        localStorage.setItem("wrongQuestionIds", JSON.stringify(merged))
      }
    } else {
      if (isCorrect) {
        localStorage.setItem("wrongQuestionIds", JSON.stringify(prev.filter((id) => id !== q.id)))
      }
    }

    if (current + 1 >= shuffled.length) {
      if (isWrongMode) {
        setClearedCount(newResults.filter((r) => r.isCorrect).length)
      }
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
    }
  }

  if (done) {
    const correct = results.filter((r) => r.isCorrect).length
    const total = shuffled.length
    const pct = Math.round((correct / total) * 100)
    const remainingWrong = JSON.parse(localStorage.getItem("wrongQuestionIds") || "[]").length

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-md flex flex-col gap-6 text-center">
          <div>
            <p className="text-5xl font-extrabold text-green-500">{pct}%</p>
            <p className="text-gray-500 mt-2 text-sm">
              {total}문제 중 {correct}개 정답
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left space-y-2">
            {isWrongMode ? (
              <>
                {clearedCount > 0 && (
                  <p className="text-green-600 font-semibold">{clearedCount}문제를 완전히 해결했어요!</p>
                )}
                {remainingWrong > 0 ? (
                  <p className="text-amber-500 font-semibold">아직 틀린 문제가 {remainingWrong}개 남아있어요.</p>
                ) : (
                  <p className="text-green-600 font-semibold">틀렸던 문제를 모두 클리어했어요!</p>
                )}
              </>
            ) : (
              <>
                {pct >= 80 && <p className="text-green-600 font-semibold">훌륭해요! 합격권입니다 🎉</p>}
                {pct >= 60 && pct < 80 && <p className="text-amber-500 font-semibold">조금 더 하면 합격!</p>}
                {pct < 60 && <p className="text-red-500 font-semibold">다시 한번 도전해봐요!</p>}
              </>
            )}
          </div>

          {isWrongMode && remainingWrong > 0 && (
            <button
              onClick={() => {
                const wrongIds = JSON.parse(localStorage.getItem("wrongQuestionIds") || "[]") as number[]
                const wrongQuestions = allQuestions.filter((q) => wrongIds.includes(q.id))
                setShuffled(shuffleArray(wrongQuestions))
                setCurrent(0)
                setResults([])
                setDone(false)
                setClearedCount(0)
              }}
              className="w-full py-4 rounded-2xl bg-red-400 text-white font-bold text-lg active:scale-95 transition-transform"
            >
              틀린 문제 다시 풀기
            </button>
          )}

          <button
            onClick={() => {
              setShuffled(shuffleArray(allQuestions))
              setCurrent(0)
              setResults([])
              setDone(false)
              setClearedCount(0)
            }}
            className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-lg active:scale-95 transition-transform"
          >
            전체 문제 풀기
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium"
          >
            홈으로
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col px-5 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 text-sm shrink-0"
          >
            ✕
          </button>
          <div className="flex-1">
            <ProgressBar current={current + 1} total={shuffled.length} />
          </div>
        </div>

        <QuestionCard
          key={current}
          question={shuffled[current]}
          questionNumber={current + 1}
          total={shuffled.length}
          onNext={handleNext}
          browseMode={isBrowseMode}
        />
      </div>
    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  )
}
