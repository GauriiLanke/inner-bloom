export default function Logo() {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-bloom-pink to-bloom-lavender shadow-bloom" />
      <div className="leading-tight">
        <div className="text-sm font-extrabold tracking-tight text-bloom-ink">Inner Bloom</div>
        <div className="text-[11px] font-semibold text-bloom-ink/60">Women’s Health</div>
      </div>
    </div>
  )
}

