import { createContext, useContext, useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Header from "./layouts/Header"
import Body from "./layouts/Body"
import Footer from "./layouts/Footer"
import { Genres } from "./types"
import Loading from "./components/Loading"
import { getGenres } from "./api/tmdb-api"
import { AuthProvider } from './context/AuthProvider'

const GlobalContext = createContext<{ genres: Genres }>({
  genres: {
    movie: [],
    tv: [],
  },
})

export const useGlobalContext = () => useContext(GlobalContext)

const App = () => {
  const [genres, setGenres] = useState<Genres>({
    movie: [],
    tv: [],
  })

  const fetchGenres = async () => {
    const movie = await getGenres("movie")
    const tv = await getGenres("tv")
    setGenres({ movie, tv })
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  if (!genres.movie.length || !genres.tv.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loading></Loading>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalContext.Provider value={{ genres }}>
          <Header />
          <Body />
          <Footer />
        </GlobalContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
