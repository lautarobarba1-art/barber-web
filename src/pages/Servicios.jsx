import { useMemo, useState } from "react"
import { promotions, services } from "../data/services.js"
import ServiceCard from "../components/ServiceCard.jsx"
import Reveal from "../components/Reveal.jsx"

const field =
  "w-full border-b border-black/15 bg-transparent py-2.5 text-[13px] tracking-[0.06em] text-black outline-none transition-colors focus:border-black/40"

export default function Servicios({ onReserve }) {
  const [category, setCategory] = useState("todas")
  const [maxPrice, setMaxPrice] = useState("")

  const filtered = useMemo(() => {
    let list = [...services]
    if (category !== "todas") {
      list = list.filter((s) => s.category === category)
    }
    const n = Number(maxPrice)
    if (Number.isFinite(n) && n > 0) {
      list = list.filter((s) => s.price <= n)
    }
    return list
  }, [category, maxPrice])

  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <Reveal>
        <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
          Servicios
        </h1>
        <p className="mb-10 max-w-[52ch] text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:text-[13px] md:tracking-[0.2em]">
          Precios claros, duración explícita. Reservá desde cualquier card.
        </p>
      </Reveal>

      <Reveal className="mb-12" delay={80}>
        <div className="flex flex-wrap items-end gap-8 md:gap-12" aria-label="Filtros de servicios">
        <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
          <label htmlFor="filter-cat" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
            Tipo
          </label>
          <select
            id="filter-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            <option value="todas">Todos</option>
            <option value="corte">Corte</option>
            <option value="barba">Barba</option>
            <option value="combo">Combo</option>
            <option value="extra">Extra</option>
          </select>
        </div>
        <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
          <label htmlFor="filter-price" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
            Precio máx. (ARS)
          </label>
          <input
            id="filter-price"
            inputMode="numeric"
            placeholder="Ej: 20000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={`${field} font-price placeholder:text-black/25`}
          />
        </div>
        </div>
      </Reveal>

      <div className="grid-3">
        {filtered.map((s, i) => (
          <Reveal key={s.id} delay={i * 65}>
            <ServiceCard service={s} onReserve={onReserve} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state mt-8">No hay servicios con esos filtros.</div>
      ) : null}

      <Reveal className="mt-16 md:mt-20">
        <section
          className="promo-banner border border-black/10 bg-linear-to-br from-black/[0.03] to-[#f2f1ec]"
          aria-labelledby="promo-title"
        >
          <h2
            id="promo-title"
            className="font-display mb-8 text-2xl font-normal uppercase tracking-[0.02em] text-black md:text-3xl"
          >
            Promociones
          </h2>
          <div className="grid-2 gap-8 md:gap-10">
            {promotions.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <article className="border-t border-black/10 pt-6">
                  <h3 className="font-display mb-3 text-xl font-normal uppercase tracking-[0.04em] text-black md:text-2xl">
                    {p.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed tracking-[0.14em] text-black/45 md:text-[13px]">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  )
}
