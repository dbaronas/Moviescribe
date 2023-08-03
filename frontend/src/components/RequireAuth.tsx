import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

type Props = {}

const RequireAuth = (props: Props) => {
  const { auth } = useAuth()
  const location = useLocation()

  // protects all nested child components
  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
