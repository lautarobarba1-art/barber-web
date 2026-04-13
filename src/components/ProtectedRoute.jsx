import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"

export default function ProtectedRoute({ children }) {
  const { user, sessionChecked } = useAuth()
  const location = useLocation()

  if (!sessionChecked) {
    return (
      <div className="section container page-enter">
        <p className="muted">Cargando sesión…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/?auth=1" replace state={{ from: location.pathname }} />
  }

  return children
}
