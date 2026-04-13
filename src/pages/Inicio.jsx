import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal.jsx"

const IMG = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`

const gallerySrc = [
  {
    src: IMG("photo-1622286342621-4bd786c2447c"),
    alt: "Detalle de corte y acabado en barbería",
    span: "lg:col-span-7",
  },
  {
    src: IMG("photo-1621605815971-fbc98d665033"),
    alt: "Herramientas de barbero sobre mesa",
    span: "lg:col-span-5",
  },
  {
    src: IMG("photo-1599351431202-1e0f0137899a"),
    alt: "Interior de barbería con sillones",
    span: "lg:col-span-5 lg:col-start-2",
  },
  {
    src: IMG("photo-1585747860715-2ba37e788b70"),
    alt: "Ambiente de trabajo en barbería",
    span: "lg:col-span-6",
  },
]

const HERO_LOCAL = "/imagenes_barberia/hero_barberia.png"
/* Misma estética oscura / barbería; carga fiable si el PNG local falla en red móvil */
const HERO_FALLBACK = IMG("photo-1621605815971-fbc98d665033", 1920)

const pillars = [
  {
    k: "01",
    t: "Precisión",
    d: "Líneas limpias y simetría real. Sin promesas vacías.",
  },
  {
    k: "02",
    t: "Ritmo",
    d: "Turnos que respetan tu tiempo y el del equipo.",
  },
  {
    k: "03",
    t: "Materiales",
    d: "Productos acordes a cada piel y cada textura.",
  },
  {
    k: "04",
    t: "Criterio",
    d: "Si un estilo no te conviene, te lo decimos.",
  },
]

export default function Inicio({ onReserve }) {
  const [heroSrc, setHeroSrc] = useState(HERO_LOCAL)

  return (
    <article className="bg-[#f2f1ec] pb-20 pt-0 sm:pb-28 md:pb-44">
      {/* Hero: hero-section = 100dvh donde hay soporte (móvil); fallback remoto si falta PNG local */}
      <section
        className="hero-section relative isolate -mt-[var(--nav-height)] w-full shrink-0 overflow-hidden bg-zinc-950"
        aria-labelledby="hero-heading"
      >
        {/* Capas solo absolute: la altura la fija .hero-section (evita colapso / h-full roto en iOS) */}
        <img
          src={heroSrc}
          alt="Interior y ambiente de la barbería Brutal Cut"
          className="hero-img-drift absolute inset-0 z-0 min-h-full min-w-full object-cover object-center [transform:translateZ(0)]"
          width={1920}
          height={1080}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          onError={() => setHeroSrc((s) => (s === HERO_FALLBACK ? s : HERO_FALLBACK))}
        />
        <div className="absolute inset-0 z-[1] bg-black/25" aria-hidden />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-black/45 via-black/15 to-transparent"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1920px] flex-col justify-center px-4 pb-8 pt-[calc(var(--nav-height)+0.75rem)] sm:px-6 sm:pb-10 md:px-10 md:pt-[calc(var(--nav-height)+0.85rem)] lg:px-16">
          <div className="hero-text pointer-events-auto max-w-[min(100%,40rem)] lg:max-w-[min(100%,44rem)]">
            <h1
              id="hero-heading"
              className="editorial-rise font-display text-[clamp(2rem,9vw,7rem)] font-normal uppercase leading-[0.88] tracking-[0.03em] sm:text-[clamp(2.5rem,10.5vw,7rem)]"
              style={{ animationDelay: "40ms" }}
            >
              <span className="hero-title-line block">Corte. Estilo.</span>
              <span className="hero-title-line mt-1 block md:mt-2">Confianza</span>
            </h1>
            <p
              className="hero-lead editorial-rise mt-8 max-w-xl text-[11px] uppercase leading-relaxed tracking-[0.38em] md:mt-10 md:text-[12px] md:tracking-[0.42em]"
              style={{ animationDelay: "120ms" }}
            >
              El arte del estilo masculino en el corazón de la ciudad.
            </p>
            <div
              className="editorial-rise mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
              style={{ animationDelay: "200ms" }}
            >
              <button type="button" className="btn-hero-primary" onClick={onReserve}>
                Reservar turno
              </button>
              <Link to="/servicios" className="btn-hero-ghost inline-flex items-center justify-center">
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Línea divisoria editorial */}
      <div className="mx-auto mt-16 max-w-[1920px] border-t border-black/10 px-5 md:mt-20 md:px-10 lg:px-20" />

      {/* Pilares — grilla asimétrica */}
      <section
        className="mx-auto mt-20 max-w-[1920px] px-5 md:mt-28 md:px-10 lg:px-20"
        aria-labelledby="pillars-heading"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4 lg:col-start-1 lg:row-span-2">
            <h2
              id="pillars-heading"
              className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal uppercase leading-none tracking-[0.02em] text-black"
            >
              ¿Por qué
              <span className="mt-2 block text-black/25">elegirnos?</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {pillars.map((p, i) => (
              <Reveal key={p.k} delay={i * 75} className="border-t border-black/10 pt-6">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.5em] text-black/35">
                  {p.k}
                </p>
                <h3 className="font-display mb-3 text-2xl font-normal uppercase tracking-[0.06em] text-black md:text-3xl">
                  {p.t}
                </h3>
                <p className="text-[12px] leading-relaxed tracking-[0.12em] text-black/45 md:text-[13px] md:tracking-[0.14em]">
                  {p.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galería — imágenes BN alto contraste */}
      <section
        className="mx-auto mt-28 max-w-[1920px] md:mt-40"
        aria-labelledby="gallery-heading"
      >
        <Reveal className="mb-12 px-5 md:mb-16 md:px-10 lg:px-20">
          <h2
            id="gallery-heading"
            className="font-display inline-block text-[clamp(1.5rem,4vw,2.25rem)] font-normal uppercase tracking-[0.02em] text-black"
          >
            Archivo visual
          </h2>
          <p className="mt-4 max-w-md text-[11px] uppercase tracking-[0.4em] text-black/40">
            Selección reciente — monocromo, alto contraste
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px bg-black/10 lg:grid-cols-12">
          {gallerySrc.map((g, i) => (
            <Reveal
              key={g.src}
              delay={i * 85}
              className={`h-full min-h-[220px] ${g.span} ${
                i % 2 === 1 ? "lg:min-h-[min(52vh,640px)]" : "lg:min-h-[min(44vh,520px)]"
              }`}
            >
              <figure
                className={`group relative h-full min-h-[220px] overflow-hidden bg-[#f2f1ec] sm:min-h-[280px] ${
                  i % 2 === 1 ? "lg:min-h-[min(52vh,640px)]" : "lg:min-h-[min(44vh,520px)]"
                }`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="gallery-tile-img h-full w-full object-cover grayscale contrast-125"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto mt-28 max-w-[1920px] border-t border-black/10 px-5 pt-20 md:mt-40 md:px-10 md:pt-28 lg:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5 lg:col-start-2">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal uppercase leading-tight tracking-[0.02em] text-black">
              Agenda con intención
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={120}>
            <p className="mb-10 max-w-md text-[12px] leading-[1.9] tracking-[0.2em] text-black/45 md:text-[13px]">
              Servicio, barbero y horario en pasos claros. Nada de relleno: solo lo necesario para
              cerrar tu turno.
            </p>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="btn-editorial-solid" onClick={onReserve}>
                Reservar turno
              </button>
              <Link
                to="/contacto"
                className="btn-editorial inline-flex items-center justify-center no-underline"
              >
                Contacto
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
