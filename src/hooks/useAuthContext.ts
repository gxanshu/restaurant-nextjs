import { useContext } from "react"
import { AuthenticationContext } from "@/app/context/AuthContext"

export default function useAuthContext() {
  const {loading, error, data, isFetchingUser, setAuthState} = useContext(AuthenticationContext)

  return {loading, error, data,isFetchingUser, setAuthState}
}