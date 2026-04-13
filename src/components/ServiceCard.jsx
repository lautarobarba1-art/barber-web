import { formatDuration, formatPrice } from "../utils/formatters.js"

export default function ServiceCard({ service, onReserve }) {
  return (
    <article className="card">
      <h3 className="card__title">{service.name}</h3>
      <p className="price">{formatPrice(service.price)}</p>
      <p className="muted">{formatDuration(service.duration)}</p>
      <p>{service.description}</p>
      <button
        type="button"
        className="btn-editorial-solid mt-4"
        onClick={() => onReserve?.(service.id)}
      >
        Reservar
      </button>
    </article>
  )
}
