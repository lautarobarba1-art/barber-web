import { useState } from "react"

const inputClass =
  "w-full border-b border-black/15 bg-transparent py-3 text-[13px] tracking-[0.06em] text-black outline-none transition-colors focus:border-black/40"

export default function Contacto() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error")
      return
    }
    setStatus("ok")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
        Contacto
      </h1>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-20">
        <div className="lg:col-span-6 lg:col-start-1">
          <p className="mb-10 max-w-md text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:text-[13px]">
            Escribinos o usá los canales directos. Respuesta en horario comercial.
          </p>
          <form onSubmit={handleSubmit} noValidate aria-label="Formulario de contacto" className="max-w-lg">
            <div className="mb-8">
              <label htmlFor="c-name" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
                Nombre
              </label>
              <input
                id="c-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="mb-8">
              <label htmlFor="c-email" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
                Email
              </label>
              <input
                id="c-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="mb-8">
              <label htmlFor="c-msg" className="mb-2 block text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
                Mensaje
              </label>
              <textarea
                id="c-msg"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className={`${inputClass} min-h-[140px] resize-y`}
              />
            </div>
            {status === "ok" ? (
              <p role="status" className="mb-6 text-[12px] tracking-[0.1em] text-black/50">
                Mensaje enviado (simulado). Te respondemos pronto.
              </p>
            ) : null}
            {status === "error" ? (
              <p role="alert" className="mb-6 text-[12px] tracking-wide text-black/55">
                Completá todos los campos.
              </p>
            ) : null}
            <button type="submit" className="btn-editorial-solid">
              Enviar
            </button>
          </form>
        </div>

        <aside className="relative z-0 flex min-h-0 flex-col gap-12 lg:col-span-5 lg:col-start-8">
          <section aria-labelledby="contacto-canales" className="relative">
            <h2
              id="contacto-canales"
              className="font-display mb-8 border-b border-black/10 pb-4 text-2xl font-normal uppercase tracking-[0.02em] text-black md:text-3xl"
            >
              Canales
            </h2>
            <nav className="flex flex-col" aria-label="Canales de contacto">
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noreferrer"
                className="border-b border-black/10 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-black/70 transition-opacity hover:opacity-100"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="border-b border-black/10 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-black/70 transition-opacity hover:opacity-100"
              >
                Instagram
              </a>
              <a
                href="mailto:hola@brutalcut.local"
                className="border-b border-black/10 py-4 font-price text-[12px] font-light tracking-[0.12em] text-black/70 transition-opacity hover:opacity-100"
              >
                hola@brutalcut.local
              </a>
              <a
                href="tel:+541123456789"
                className="border-b border-black/10 py-4 font-price text-[12px] font-light tracking-[0.12em] text-black/70 transition-opacity hover:opacity-100"
              >
                +54 11 2345-6789
              </a>
            </nav>
          </section>
          <section aria-labelledby="contacto-atencion" className="border-t border-black/10 pt-10">
            <h2
              id="contacto-atencion"
              className="font-display mb-6 text-xl font-normal uppercase tracking-[0.03em] text-black md:mb-8 md:text-2xl"
            >
              Atención
            </h2>
            <ul className="space-y-3 font-price text-[11px] font-light tracking-[0.14em] text-black/55">
              <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
                <span>Lun — Vie</span>
                <span>10:00 — 20:00</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
                <span>Sábado</span>
                <span>09:00 — 14:00</span>
              </li>
              <li className="flex justify-between gap-4 pb-2">
                <span>Domingo</span>
                <span>Cerrado</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
