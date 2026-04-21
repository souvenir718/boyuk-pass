"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface HomeStatsProps {
  total: number
}

export default function HomeStats({ total }: HomeStatsProps) {
  const [wrongCount, setWrongCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("wrongQuestionIds")
    if (stored) {
      setWrongCount(JSON.parse(stored).length)
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-around text-center">
      <button
        className="flex flex-col items-center"
        onClick={() => router.push("/quiz?mode=browse")}
      >
        <p className="text-2xl font-bold text-gray-900">{total}</p>
        <p className="text-xs text-gray-400 mt-1">전체 문제</p>
      </button>
      <div className="w-px bg-gray-100" />
      <button
        className="flex flex-col items-center disabled:opacity-40"
        onClick={() => router.push("/quiz?mode=wrong")}
        disabled={wrongCount === 0}
      >
        <p className="text-2xl font-bold text-red-400">{wrongCount}</p>
        <p className="text-xs text-gray-400 mt-1">틀렸던 문제</p>
      </button>
    </div>
  )
}
