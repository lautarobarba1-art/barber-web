export default function TeamCard({ member, onAvailability }) {
  return (
    <article className="card">
      <img
        className="team-card__img"
        src={member.image}
        alt={`Retrato de ${member.name}, barbero`}
        width={400}
        height={533}
        loading="lazy"
      />
      <h3 className="card__title mt-4">{member.name}</h3>
      <p className="muted">{member.specialty}</p>
      <p>
        <span className="price text-base">{member.rating}</span>{" "}
        <span className="muted">· {member.reviews} reseñas</span>
      </p>
      <p className="muted text-[13px]">{member.availability.join(" · ")}</p>
      <button
        type="button"
        className="btn-editorial mt-4"
        onClick={() => onAvailability?.(member.id)}
      >
        Ver disponibilidad
      </button>
    </article>
  )
}
