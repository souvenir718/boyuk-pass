interface OptionItemProps {
  index: number
  text: string
  selected: boolean
  revealed: boolean
  isCorrect: boolean
  onClick: () => void
}

const LABELS = ["①", "②", "③", "④", "⑤", "⑥"]

export default function OptionItem({
  index,
  text,
  selected,
  revealed,
  isCorrect,
  onClick,
}: OptionItemProps) {
  let bgClass = "bg-white border-gray-200"
  let labelClass = "text-gray-500"
  let textClass = "text-gray-800"
  let icon: string | null = null

  if (revealed) {
    if (isCorrect) {
      bgClass = "bg-green-50 border-green-400"
      labelClass = "text-green-600"
      textClass = "text-green-800 font-semibold"
      icon = "✓"
    } else if (selected && !isCorrect) {
      bgClass = "bg-red-50 border-red-400"
      labelClass = "text-red-400"
      textClass = "text-red-700"
      icon = "✗"
    }
  } else if (selected) {
    bgClass = "bg-blue-50 border-blue-400"
    labelClass = "text-blue-500"
  }

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${bgClass} ${
        !revealed ? "active:scale-95" : ""
      }`}
    >
      <span className={`font-semibold mr-2 ${labelClass}`}>{LABELS[index]}</span>
      <span className={`text-sm leading-relaxed ${textClass}`}>{text}</span>
      {icon && (
        <span className={`float-right font-bold text-base ${isCorrect ? "text-green-500" : "text-red-400"}`}>
          {icon}
        </span>
      )}
    </button>
  )
}
