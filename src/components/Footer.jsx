import { Link } from "react-router-dom"
import BrutalCutLogo from "./BrutalCutLogo.jsx"
import Reveal from "./Reveal.jsx"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 bg-[#f2f1ec]">
      <div className="mx-auto max-w-[1920px] px-5 py-14 md:px-10 md:py-20 lg:px-16">
        <Reveal>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-4">
              <BrutalCutLogo variant="dark" className="h-11 w-11 shrink-0 md:h-14 md:w-14" />
              <p className="font-display text-2xl font-normal uppercase tracking-[0.12em] text-black md:text-3xl">
                Brutal Cut
              </p>
            </div>
            <p className="text-[11px] leading-[1.85] tracking-[0.2em] text-black/45">
              <span className="font-price text-[12px] font-light text-black/55">©</span>{" "}
              <span className="uppercase tracking-[0.24em]">Brutal Cut.</span> Todos los derechos reservados.{" "}
              <span className="text-black/35">{year}</span>
            </p>
          </div>
          <div className="flex flex-col gap-5 text-right md:items-end">
            <p className="max-w-sm text-[10px] font-medium uppercase tracking-[0.35em] text-black/40 md:text-[11px] md:tracking-[0.4em]">
              Diseñado y desarrollado por{" "}
              <span className="whitespace-nowrap text-black/55">T A R O .</span>
            </p>
            <Link
              to="/privacidad"
              className="inline-block border-b border-black/15 pb-0.5 text-[10px] font-medium uppercase tracking-[0.38em] text-black/50 transition-[color,border-color,transform] duration-300 ease-out hover:border-black/35 hover:text-black/70 motion-safe:hover:-translate-y-px"
            >
              Políticas de privacidad
            </Link>
          </div>
        </div>
        </Reveal>
      </div>
    </footer>
  )
}
