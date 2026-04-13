import { useState } from "react"

function Icon({ name }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    "aria-hidden": true,
  }
  switch (name) {
    case "drop":
      return (
        <svg {...common}>
          <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z" />
        </svg>
      )
    case "scissors":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4 9 15M14 4l6 6M9 9l6 6" />
        </svg>
      )
    case "camera":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="12" />
          <path d="M7 7V5h4v2M10 12h.01" />
        </svg>
      )
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" />
        </svg>
      )
  }
}

export default function TipCard({ tip }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="card">
      <div className="tip-card__icon">
        <Icon name={tip.icon} />
      </div>
      <span className="badge">{tip.category}</span>
      <h3 className="card__title" style={{ marginTop: "0.75rem" }}>
        {tip.title}
      </h3>
      <p>{open ? `${tip.short} ${tip.long}` : tip.short}</p>
      <button
        type="button"
        className="tip-card__expand"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Leer menos" : "Leer más"}
      </button>
    </article>
  )
}
