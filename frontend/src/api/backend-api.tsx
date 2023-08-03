import axios from "axios"

const BASE_URL = `http://localhost:8080/`

export const axiosBackend = axios.create({
  baseURL: BASE_URL,
})

// instance supporting interceptors to refresh the access token
export const axiosBackendPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

export const login = async (username: string, password: string) => {
  try {
    if (username && password) {
      const res = await axiosBackend.post(
        "/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      return res.data
    }
  } catch (error) {
    console.error(error)
  }
}

export const register = async (
  username: string,
  password: string,
  confirmPassword: string
) => {
  try {
    if (username && password && confirmPassword) {
      const res = await axiosBackend.post(
        "/register",
        {
          username,
          password,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      return res.data
    }
  } catch (error) {
    return error
  }
}
