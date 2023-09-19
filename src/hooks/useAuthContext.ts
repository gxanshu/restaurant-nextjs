import { useContext } from "react"
import { AuthenticationContext } from "@/app/context/AuthContext"

export default function useAuthContext() {
  const {loading, error, data, setAuthState} = useContext(AuthenticationContext)

  return {loading, error, data, setAuthState}
}