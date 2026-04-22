"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

interface HomeCategoryQuizProps {
  categories: string[]
}

export default function HomeCategoryQuiz({ categories }: HomeCategoryQuizProps) {
  const [selected, setSelected] = useState<string>("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleStart() {
    if (selected) {
      router.push(`/quiz?category=${encodeURIComponent(selected)}`)
    } else {
      router.push("/quiz")
    }
  }

  const options = ["", ...categories]
  const label = selected || "전체 랜덤"

  return (
    <div className="flex flex-col gap-3">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white text-sm font-medium text-gray-700 flex items-center justify-between focus:outline-none focus:border-green-400"
        >
          <span className={selected ? "text-gray-900" : "text-gray-400"}>{label}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg overflow-y-auto max-h-64">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setOpen(false) }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  selected === opt
                    ? "bg-green-50 text-green-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt || "전체 랜덤"}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-base shadow-md active:scale-95 transition-transform"
      >
        {selected ? `${selected} 시작` : "랜덤 퀴즈 시작"}
      </button>

      <p className="text-center text-xs text-gray-400">
        문제는 매번 랜덤 순서로 출제됩니다
      </p>
    </div>
  )
}
