import React, { createContext, useState } from "react"

type Props = {
  children: React.ReactNode
}

type AuthContextType = {
  auth: any 
  setAuth: React.Dispatch<React.SetStateAction<any>>
}

export const AuthContext = createContext<AuthContextType>({
    auth: {},
    setAuth: () => {},
})

export const AuthProvider = (props: Props) => {
  const [auth, setAuth] = useState({})
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
}
