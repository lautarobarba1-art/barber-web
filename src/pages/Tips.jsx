import { tips } from "../data/tips.js"
import TipCard from "../components/TipCard.jsx"

export default function Tips() {
  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
        Tips
      </h1>
      <p className="mb-10 max-w-[46ch] text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:mb-12 md:text-[13px]">
        Texto útil, cero humo. Expandí cuando quieras profundizar.
      </p>
      <div className="grid-2">
        {tips.map((t) => (
          <TipCard key={t.id} tip={t} />
        ))}
      </div>
    </div>
  )
}
