import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import AuthModal from "./components/AuthModal.jsx"
import ReservationFlow from "./components/ReservationFlow.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Inicio from "./pages/Inicio.jsx"
import Servicios from "./pages/Servicios.jsx"
import Equipo from "./pages/Equipo.jsx"
import Tips from "./pages/Tips.jsx"
import Contacto from "./pages/Contacto.jsx"
import Ubicacion from "./pages/Ubicacion.jsx"
import MisTurnos from "./pages/MisTurnos.jsx"
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad.jsx"
import EditorialGrain from "./components/EditorialGrain.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import "./styles/App.css"

function Shell() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [authOpen, setAuthOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [reservationMountId, setReservationMountId] = useState(0)
  const [initialServiceId, setInitialServiceId] = useState(null)
  const [initialBarberId, setInitialBarberId] = useState(null)

  useEffect(() => {
    if (searchParams.get("auth") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- abrir modal tras redirect desde ruta protegida
      setAuthOpen(true)
      const next = new URLSearchParams(searchParams)
      next.delete("auth")
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  function openReservation({ serviceId, barberId } = {}) {
    setInitialServiceId(serviceId ?? null)
    setInitialBarberId(barberId ?? null)
    setReservationMountId((k) => k + 1)
    setReservationOpen(true)
  }

  function closeReservation() {
    setReservationOpen(false)
    setInitialServiceId(null)
    setInitialBarberId(null)
  }

  return (
    <div className="relative isolate min-h-dvh bg-[#f2f1ec] font-sans text-black antialiased">
      <ScrollToTop />
      <EditorialGrain />
      <div className="relative z-10 flex min-h-dvh flex-col">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Inicio onReserve={() => openReservation({})} />} />
          <Route
            path="/servicios"
            element={
              <Servicios onReserve={(serviceId) => openReservation({ serviceId })} />
            }
          />
          <Route
            path="/equipo"
            element={
              <Equipo onReserveBarber={(barberId) => openReservation({ barberId })} />
            }
          />
          <Route path="/tips" element={<Tips />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/ubicacion" element={<Ubicacion />} />
          <Route
            path="/mis-turnos"
            element={
              <ProtectedRoute>
                <MisTurnos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <ReservationFlow
        key={reservationMountId}
        isOpen={reservationOpen}
        onClose={closeReservation}
        initialServiceId={initialServiceId}
        initialBarberId={initialBarberId}
        onNeedAuth={() => setAuthOpen(true)}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  )
}
