import { team } from "../data/team.js"
import TeamCard from "../components/TeamCard.jsx"
import Reveal from "../components/Reveal.jsx"

export default function Equipo({ onReserveBarber }) {
  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <Reveal>
        <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
          Equipo
        </h1>
        <p className="mb-10 max-w-[48ch] text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:mb-12 md:text-[13px]">
          Tres manos, tres obsesiones. Elegí quién te corta y reservá disponibilidad.
        </p>
      </Reveal>
      <div className="grid-3">
        {team.map((m, i) => (
          <Reveal key={m.id} delay={i * 75} className="min-w-0 w-full">
            <TeamCard member={m} onAvailability={() => onReserveBarber?.(m.id)} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
