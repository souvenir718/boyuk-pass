import Link from "next/link"
import questions from "@/data/questions.json"
import HomeStats from "@/components/HomeStats"

export default function Home() {
  const total = questions.length

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600 tracking-tight">보육패스</h1>
          <p className="text-gray-500 text-sm mt-2">원장 사전직무 교육 기출 학습</p>
        </div>

        {/* 통계 카드 */}
        <HomeStats total={total} />

        {/* 시작 버튼 */}
        <Link
          href="/quiz"
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-center text-lg shadow-md active:scale-95 transition-transform"
        >
          랜덤 퀴즈 시작
        </Link>

        <p className="text-center text-xs text-gray-400">
          문제는 매번 랜덤 순서로 출제됩니다
        </p>
      </div>
    </main>
  )
}
