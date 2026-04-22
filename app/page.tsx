import questions from "@/data/questions.json"
import HomeStats from "@/components/HomeStats"
import HomeCategoryQuiz from "@/components/HomeCategoryQuiz"
import { Question } from "@/types/question"

export default function Home() {
  const qs = questions as Question[]
  const total = qs.length
  const categories = Array.from(new Set(qs.map((q) => q.category).filter(Boolean))) as string[]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600 tracking-tight">보육패스</h1>
          <p className="text-gray-500 text-sm mt-2">원장 사전직무 교육 기출 학습</p>
        </div>

        {/* 통계 카드 */}
        <HomeStats total={total} />

        {/* 카테고리 선택 + 시작 */}
        <HomeCategoryQuiz categories={categories} />
      </div>
    </main>
  )
}
