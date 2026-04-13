import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import BrutalCutLogo from "./BrutalCutLogo.jsx"

const NAV_LINKS = [
  { to: "/", end: true, label: "Inicio" },
  { to: "/servicios", end: false, label: "Servicios" },
  { to: "/equipo", end: false, label: "Equipo" },
  { to: "/tips", end: false, label: "Tips" },
  { to: "/contacto", end: false, label: "Contacto" },
  { to: "/ubicacion", end: false, label: "Ubicación" },
]

function navClassDefault({ isActive }) {
  return [
    "whitespace-nowrap border-b border-transparent pb-1 text-[10px] font-medium uppercase tracking-[0.38em] transition-[opacity,transform,color] duration-300 ease-out",
    isActive
      ? "border-black/25 text-black opacity-100"
      : "text-black/55 hover:opacity-90 motion-safe:hover:-translate-y-px",
  ].join(" ")
}

function navClassOverlay({ isActive }) {
  return [
    "whitespace-nowrap border-b border-transparent pb-1 text-[10px] font-medium uppercase tracking-[0.38em] transition-[opacity,transform,color] duration-300 ease-out",
    isActive ? "border-white/50 text-white opacity-100" : "text-white/85 hover:text-white hover:opacity-100 motion-safe:hover:-translate-y-px",
  ].join(" ")
}

function navClassMega({ isActive }) {
  return [
    "block w-full border-b border-black/10 py-4 text-left text-[12px] font-medium uppercase tracking-[0.35em] transition-colors",
    isActive ? "bg-black/[0.04] text-black" : "text-black/70 active:bg-black/[0.06]",
  ].join(" ")
}

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === "/"
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroOverlay, setHeroOverlay] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      const vh = window.innerHeight || 800
      setHeroOverlay(isHome && y < vh * 0.88)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [isHome])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  const overlay = heroOverlay && !menuOpen
  const navClass = overlay ? navClassOverlay : navClassDefault

  const megaMenu =
    menuOpen &&
    createPortal(
      <div
        id="mega-menu-panel"
        className="fixed inset-0 z-200 flex h-svh min-h-0 w-full max-w-none flex-col bg-[#f2f1ec] supports-[height:100dvh]:h-dvh lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:px-6">
          <span className="flex items-center gap-2.5 font-display text-xl uppercase tracking-[0.12em] text-black">
            <BrutalCutLogo variant="dark" className="h-8 w-8 shrink-0" />
            Brutal Cut
          </span>
          <button
            type="button"
            className="border border-black/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/80 transition-colors hover:bg-black/[0.04]"
            onClick={closeMenu}
          >
            Cerrar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-2 [-webkit-overflow-scrolling:touch] sm:px-6">
          <nav className="flex flex-col" aria-label="Principal">
            {NAV_LINKS.map(({ to, end, label }) => (
              <NavLink key={to + String(end)} to={to} end={end} className={navClassMega} onClick={closeMenu}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="shrink-0 space-y-3 border-t border-black/10 bg-[#f2f1ec] p-4 pb-[max(1.25rem,env(safe-area-inset-bottom,1rem))] sm:px-6">
          {user && (
            <Link
              to="/mis-turnos"
              className="btn-editorial-solid block w-full text-center no-underline"
              onClick={closeMenu}
            >
              Mis turnos
            </Link>
          )}
          {user ? (
            <button type="button" className="btn-editorial w-full" onClick={() => { closeMenu(); logout() }}>
              Salir
            </button>
          ) : (
            <button type="button" className="btn-editorial w-full" onClick={() => { closeMenu(); onOpenAuth?.() }}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>,
      document.body
    )

  return (
    <>
    <header
      className={`sticky top-0 border-b transition-[background-color,box-shadow,border-color,backdrop-filter,z-index] duration-500 ease-out ${
        menuOpen ? "z-140" : "z-50"
      } ${
        overlay
          ? "border-white/15 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl backdrop-saturate-150"
          : scrolled
            ? "border-black/10 bg-[#f2f1ec]/45 shadow-[0_12px_48px_-16px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-black/[0.08] bg-[#f2f1ec]/38 shadow-none backdrop-blur-xl backdrop-saturate-150"
      }`}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10 md:py-5 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-4 lg:px-10 lg:py-6 xl:px-16">
        <div className="flex min-w-0 flex-1 items-center justify-between lg:col-span-3 lg:w-auto lg:justify-start">
          <Link
            to="/"
            className={`flex items-center gap-2.5 font-display text-xl font-normal uppercase tracking-[0.14em] transition-[opacity,transform,color] duration-300 ease-out hover:opacity-90 motion-safe:hover:-translate-y-0.5 sm:gap-3 sm:text-2xl ${
              overlay ? "text-white" : "text-black"
            }`}
            onClick={closeMenu}
          >
            <BrutalCutLogo
              variant={overlay ? "light" : "dark"}
              className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
            />
            Brutal Cut
          </Link>
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mega-menu-panel"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Cerrar menú" : "Abrir menú"}</span>
            <span className={`h-px w-6 ${!menuOpen && overlay ? "bg-white" : "bg-black"}`} aria-hidden />
            <span className={`h-px w-6 ${!menuOpen && overlay ? "bg-white" : "bg-black"}`} aria-hidden />
            <span className={`h-px w-6 ${!menuOpen && overlay ? "bg-white" : "bg-black"}`} aria-hidden />
          </button>
        </div>

        {/* Desktop */}
        <nav
          id="nav-primary"
          aria-label="Principal"
          className="hidden w-full flex-row flex-nowrap justify-center gap-x-3 overflow-x-auto lg:col-span-6 lg:flex lg:gap-x-3 lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden xl:gap-x-7"
        >
          {NAV_LINKS.map(({ to, end, label }) => (
            <NavLink key={to + String(end)} to={to} end={end} className={navClass} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden w-full flex-row flex-nowrap justify-end gap-3 lg:col-span-3 lg:flex">
          {user && (
            <Link
              to="/mis-turnos"
              className={`text-center text-[10px] font-semibold uppercase tracking-[0.35em] no-underline transition-[transform,opacity] duration-300 md:min-w-0 md:px-5 md:py-2.5 ${
                overlay
                  ? "rounded-full bg-white px-5 py-2.5 text-black hover:opacity-90"
                  : "btn-editorial-solid md:px-4 md:py-2.5 md:text-[10px]"
              }`}
              onClick={closeMenu}
            >
              Mis turnos
            </Link>
          )}
          {user ? (
            <button
              type="button"
              className={
                overlay
                  ? "rounded-full border-2 border-white bg-transparent px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:bg-white/10"
                  : "btn-editorial"
              }
              onClick={() => {
                closeMenu()
                logout()
              }}
            >
              Salir
            </button>
          ) : (
            <button
              type="button"
              className={
                overlay
                  ? "rounded-full border-2 border-white bg-transparent px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:bg-white/10"
                  : "btn-editorial"
              }
              onClick={() => {
                closeMenu()
                onOpenAuth?.()
              }}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
    {megaMenu}
    </>
  )
}
