interface OptionItemProps {
  index: number
  text: string
  selected: boolean
  revealed: boolean
  isCorrect: boolean
  onClick: () => void
}

const LABELS = ["①", "②", "③", "④", "⑤"]

export default function OptionItem({
  index,
  text,
  selected,
  revealed,
  isCorrect,
  onClick,
}: OptionItemProps) {
  let bgClass = "bg-white border-gray-200"

  if (revealed) {
    if (isCorrect) {
      bgClass = "bg-green-50 border-green-400"
    } else if (selected && !isCorrect) {
      bgClass = "bg-red-50 border-red-400"
    } else {
      bgClass = "bg-white border-gray-200"
    }
  } else if (selected) {
    bgClass = "bg-blue-50 border-blue-400"
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${bgClass} ${
        !revealed ? "active:scale-95" : ""
      }`}
    >
      <span className="font-semibold text-gray-500 mr-2">{LABELS[index]}</span>
      <span className="text-gray-800 text-sm leading-relaxed">{text}</span>
    </button>
  )
}
