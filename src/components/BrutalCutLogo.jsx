/**
 * Isotipo: tijeras de barbero (trazo editorial).
 * `light` = nav sobre foto; `dark` = footer y barra clara.
 */
export default function BrutalCutLogo({
  variant = "dark",
  className = "",
  "aria-hidden": ariaHidden = true,
  title,
}) {
  const strokeClass =
    variant === "light"
      ? "text-[#f2f1ec]"
      : "text-[#0a0a0a]"

  return (
    <svg
      className={`${strokeClass} ${className}`.trim()}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Mitad izquierda: punta → eje → mango / aro */}
        <path d="M9 7 L32 28 L13 49" />
        {/* Mitad derecha */}
        <path d="M55 7 L32 28 L51 49" />
        {/* Eje */}
        <circle cx="32" cy="28" r="3.5" />
        {/* Aros */}
        <circle cx="12" cy="51" r="5.5" />
        <circle cx="52" cy="51" r="5.5" />
      </g>
    </svg>
  )
}
