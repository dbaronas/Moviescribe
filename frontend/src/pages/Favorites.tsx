import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getInTheaters } from "../api/tmdb-api"
import Card from "../components/Card"
import Section from "../components/Section"
import Slider from "../components/slider/Slider"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Favorite, Film } from "../interfaces"
import { tmdbImageSrc } from "../utils"

const Favorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [inTheaters, setInTheaters] = useState<Film[]>([])

  const axiosBackendPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const getFavorites = async () => {
      try {
        const res = await axiosBackendPrivate.get("/favorites", {
          signal: controller.signal,
        })
        isMounted && setFavorites(res.data.favorites)
      } catch (error) {
        console.error(error)
      }
    }
    getFavorites()
    const fetchInTheaters = async () => {
      setInTheaters(await getInTheaters())
    }
    fetchInTheaters()
    // when component unmounts cancel pending requests
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const filteredFavorites = inTheaters.filter((inTheater) =>
    favorites.some(
      (favorite) =>
        inTheater.mediaType === favorite.mediaType &&
        inTheater.id === favorite.filmId
    )
  )

  const goToDetailPage = (film: Film) => {
    navigate(`/favorites/${film.mediaType}/${film.id}`)
  }

  return (
    <>
      <Section hidden={inTheaters.length === 0}>
        <h1 className="text-center text-4lg font-medium my-3">Favorites</h1>
        <Slider isMovieCard={true} autoplay={true}>
          {(_) =>
            filteredFavorites.map((inTheater) => (
              <Card
                onClick={() => goToDetailPage(inTheater)}
                title={inTheater.title}
                key={inTheater.id}
                imageSrc={tmdbImageSrc(inTheater.posterPath)}
              ></Card>
            ))
          }
        </Slider>
      </Section>
    </>
  )
}

export default Favorites
