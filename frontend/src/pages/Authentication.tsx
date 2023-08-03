import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { login, register } from "../api/backend-api"
import useAuth from "../hooks/useAuth"
import { LoginFormData, RegisterFormData } from "../interfaces"

interface Props {
  type: "Sign In" | "Sign Up"
}

const Authentication = (props: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const { setAuth } = useAuth()
  const [formData, setFormData] = useState<LoginFormData | RegisterFormData>(
    props.type === "Sign In"
      ? {
          username: "",
          password: "",
        }
      : {
          username: "",
          password: "",
          confirmPassword: "",
        }
  )

  const resetInputs = () => {
    setFormData(
      props.type === "Sign In"
        ? {
            username: "",
            password: "",
          }
        : {
            username: "",
            password: "",
            confirmPassword: "",
          }
    )
  }

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (props.type === "Sign In") {
      const res = await login(formData.username, formData.password)
      const accessToken = await res.accessToken
      const refreshToken = await res.refreshToken
      setAuth({
        user: {
          username: formData.username,
          password: formData.password,
          accessToken,
          refreshToken,
        },
      })
    } else {
      const res = await register(
        formData.username,
        formData.password,
        (formData as RegisterFormData).confirmPassword
      )
      const accessToken = await res.accessToken
      const refreshToken = await res.refreshToken
      setAuth({
        user: {
          username: formData.username,
          password: formData.password,
          accessToken,
          refreshToken,
        },
      })
    }
    resetInputs()
    navigate(from, { replace: true })
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col mt-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mb-5 mobile:text-2xl mobile:mt-3 font-semibold">
          {props.type}
        </h1>
        <form
          className="flex flex-col gap-5 w-[350px] h-[500px] text-xl mt-3 mobile:gap-6 mobile:text-xl font-normal rounded-md"
          onSubmit={(e) => onSubmitForm(e)}
        >
          <label>Enter username</label>
          <input
            placeholder="Enter username"
            className="p-1 text-primary text-lg w-full"
            onChange={onChangeInput}
            type="text"
            name="username"
            value={formData.username}
            required
          />
          <label>Enter password</label>
          <input
            placeholder="Enter password"
            className="p-1 text-primary text-lg w-full"
            onChange={onChangeInput}
            type="password"
            name="password"
            value={formData.password}
            required
          />
          {props.type === "Sign Up" && ( // Render confirmPassword field for Register only
            <>
              <label>Confirm password</label>
              <input
                placeholder="Confirm password"
                className="p-1 text-primary text-lg w-full"
                onChange={onChangeInput}
                type="password"
                name="confirmPassword"
                value={(formData as RegisterFormData).confirmPassword}
                required
              />
            </>
          )}
          <button
            className="bg-primary rounded-md hover:text-body p-1 mt-1"
            type="submit"
          >
            Submit
          </button>
          {props.type === "Sign In" && ( // Render confirmPassword field for Register only
            <>
              <span className="hover:text-primary text-md">
                <a href="/register">Don't have an account? Sign up here</a>
              </span>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default Authentication
