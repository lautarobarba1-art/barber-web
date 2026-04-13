export default function Ubicacion() {
  const q = encodeURIComponent("Av. Corrientes 1234, CABA, Argentina")
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`

  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
        Ubicación
      </h1>
      <p className="mb-4 text-[15px] font-medium tracking-[0.06em] text-black md:text-lg">
        Av. Corrientes 1234, CABA
      </p>
      <p className="mb-10 max-w-[52ch] text-[12px] leading-relaxed tracking-[0.18em] text-black/50 md:text-[13px]">
        Subte B · línea a metros. Entrada sobre vereda norte. Cartel discreto, tipografía contenida.
      </p>
      <iframe
        title="Mapa de la barbería en Google Maps"
        className="map-frame w-full min-h-[320px] border border-black/10"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
      />
      <div className="mt-12 md:mt-16">
        <h2 className="font-display mb-8 border-b border-black/10 pb-4 text-2xl font-normal uppercase tracking-[0.02em] text-black md:text-3xl">
          Horarios en sede
        </h2>
        <ul className="max-w-md space-y-3 font-price text-[11px] font-light tracking-[0.14em] text-black/55">
          <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
            <span>Lunes</span>
            <span>10:00 — 20:00</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
            <span>Martes</span>
            <span>10:00 — 20:00</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
            <span>Miércoles</span>
            <span>10:00 — 20:00</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
            <span>Jueves</span>
            <span>10:00 — 20:00</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
            <span>Viernes</span>
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
      </div>
    </div>
  )
}
