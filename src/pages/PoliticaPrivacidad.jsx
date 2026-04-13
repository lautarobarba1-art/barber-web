export default function PoliticaPrivacidad() {
  return (
    <div className="page-enter mx-auto max-w-[1920px] px-5 py-12 md:px-10 md:py-16 lg:px-20">
      <h1 className="font-display mb-6 border-b border-black/10 pb-4 text-4xl font-normal uppercase tracking-[0.02em] text-black md:text-5xl">
        Políticas de privacidad
      </h1>
      <div className="max-w-2xl space-y-8 text-[13px] leading-relaxed tracking-[0.08em] text-black/65">
        <p>
          En <span className="text-black">Brutal Cut</span> tratamos tus datos personales con criterio mínimo: solo lo
          necesario para gestionar turnos, contacto y mejorar el servicio.
        </p>
        <p>
          Los datos que nos enviás por el formulario de contacto o al crear una cuenta se usan para responderte y operar
          el turnero. No vendemos ni compartimos tu información con terceros con fines comerciales.
        </p>
        <p>
          Podés solicitar acceso, rectificación o baja escribiendo a{" "}
          <a href="mailto:hola@brutalcut.local" className="border-b border-black/20 text-black transition-colors hover:border-black/50">
            hola@brutalcut.local
          </a>
          .
        </p>
        <p className="text-[12px] text-black/45">
          Esta política puede actualizarse; la fecha de vigencia se considera la de la última modificación publicada en
          este sitio.
        </p>
      </div>
    </div>
  )
}
