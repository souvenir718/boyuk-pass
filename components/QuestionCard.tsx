"use client"

import { useState, useEffect } from "react"
import { Question } from "@/types/question"
import { hasAnswer } from "@/lib/utils"
import OptionItem from "./OptionItem"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  total: number
  onNext: (isCorrect: boolean) => void
  browseMode?: boolean
}

export default function QuestionCard({
  question,
  questionNumber,
  total,
  onNext,
  browseMode = false,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(browseMode)
  const [shortInput, setShortInput] = useState("")
  const [bannerVisible, setBannerVisible] = useState(false)

  const isShort = question.type === "short"
  const answerReady = hasAnswer(question)
  const correctIndex = typeof question.answer === "number" ? question.answer : null

  const isCorrectAnswer = revealed
    ? isShort
      ? shortInput.trim() === String(question.answer).trim()
      : selected === correctIndex
    : null

  useEffect(() => {
    if (revealed && !browseMode) {
      setBannerVisible(true)
    }
  }, [revealed, browseMode])

  function handleSelect(index: number) {
    if (revealed || !answerReady || browseMode) return
    setSelected(index)
    setRevealed(true)
  }

  function handleShortSubmit() {
    if (!shortInput.trim()) return
    setRevealed(true)
  }

  function handleNext() {
    setBannerVisible(false)
    setSelected(null)
    setRevealed(false)
    setShortInput("")
    onNext(isCorrectAnswer ?? false)
  }

  const hasBottomButtons = revealed || !answerReady || (isShort && !browseMode)

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* 문제 번호 + 제목 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-green-600">문제 {questionNumber} / {total}</p>
          {question.category && (
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              {question.category}
            </span>
          )}
        </div>
        <h2 className="text-base font-bold text-gray-900 leading-snug">
          {question.title}
        </h2>
        {!answerReady && (
          <p className="mt-2 text-xs text-amber-500">⚠ 정답이 아직 등록되지 않은 문제입니다.</p>
        )}
      </div>

      {/* 정답/오답 배너 */}
      {bannerVisible && (
        <div
          className={`rounded-2xl px-5 py-4 flex items-center gap-3 animate-[fadeSlideIn_0.25s_ease-out] ${
            isCorrectAnswer
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="text-2xl">{isCorrectAnswer ? "🎉" : "😢"}</span>
          <div>
            {isCorrectAnswer ? (
              <p className="font-bold text-base">정답입니다!</p>
            ) : (
              <>
                {!isShort && correctIndex !== null && (
                  <p className="font-bold text-base">정답은 {["①","②","③","④","⑤","⑥"][correctIndex]}번이에요</p>
                )}
                {isShort && (
                  <p className="font-bold text-base">정답: {question.answer}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 단답형 입력 */}
      {isShort && !browseMode && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={shortInput}
            onChange={(e) => setShortInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !revealed) handleShortSubmit() }}
            disabled={revealed}
            placeholder="정답을 입력하세요"
            className={`w-full px-4 py-3 rounded-2xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
              revealed
                ? isCorrectAnswer
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-700 line-through"
                : "bg-white border-gray-200 focus:border-green-400"
            }`}
          />
        </div>
      )}

      {/* browse 모드 단답형 정답 표시 */}
      {isShort && browseMode && (
        <div className="bg-green-50 rounded-2xl px-4 py-3 border border-green-100">
          <p className="text-xs font-semibold text-green-600 mb-1">정답</p>
          <p className="text-sm font-bold text-gray-900">{question.answer}</p>
        </div>
      )}

      {/* 보기 목록 (multiple/ox) */}
      {!isShort && (
        <div className="flex flex-col gap-2">
          {question.details.map((detail, i) => (
            <OptionItem
              key={i}
              index={i}
              text={detail}
              selected={selected === i}
              revealed={revealed}
              isCorrect={i === correctIndex}
              onClick={() => handleSelect(i)}
            />
          ))}
        </div>
      )}

      {/* 해설 */}
      {revealed && question.explanation && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-500 mb-1">해설</p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* 하단 고정 버튼 영역 */}
      {hasBottomButtons && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-white border-t border-gray-100 flex flex-col gap-2">
          {/* 단답형 제출 버튼 */}
          {isShort && !browseMode && !revealed && (
            <button
              onClick={handleShortSubmit}
              disabled={!shortInput.trim()}
              className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base active:scale-95 transition-transform disabled:opacity-40"
            >
              정답 제출
            </button>
          )}

          {/* 정답 확인 후 다음 버튼 */}
          {(revealed || (!isShort && !answerReady)) && (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base active:scale-95 transition-transform"
            >
              {questionNumber === total ? "결과 보기" : "다음 문제"}
            </button>
          )}

          {/* 정답 미등록 시 스킵 안내 */}
          {!answerReady && !revealed && !isShort && (
            <button
              onClick={() => onNext(false)}
              className="w-full py-3 rounded-2xl bg-gray-100 text-gray-500 font-medium text-sm"
            >
              건너뛰기
            </button>
          )}
        </div>
      )}
    </div>
  )
}
