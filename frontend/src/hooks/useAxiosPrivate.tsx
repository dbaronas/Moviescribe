import { useEffect } from "react"
import { axiosBackendPrivate } from "../api/backend-api"
import useAuth from "./useAuth"
import useRefreshToken from "./useRefreshToken"

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()


  // async error handling if the token expires, set new access token in authorization header
  // it will have interceptors added to handle jwt tokens
  useEffect(() => {
    const requestIntercept = axiosBackendPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.user.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = axiosBackendPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
          return axiosBackendPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosBackendPrivate.interceptors.request.eject(requestIntercept)
      axiosBackendPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosBackendPrivate
}

export default useAxiosPrivate
