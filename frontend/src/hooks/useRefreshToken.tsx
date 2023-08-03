import { axiosBackend } from "../api/backend-api"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth()

  const refresh = async () => {
    try {
      const res = await axiosBackend.post(
        "/refresh",
        { token: auth.user.refreshToken }, // Send the refresh token in the request body
        {
          withCredentials: true,
        }
      )

      setAuth((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          accessToken: res.data.accessToken,
        },
      }))

      return res.data.accessToken
    } catch (error) {
      console.error(error)
    }
  }

  return refresh
}

export default useRefreshToken
