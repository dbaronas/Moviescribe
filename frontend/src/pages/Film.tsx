import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  getCasts,
  getDetail,
  getRecommendations,
  getTrailers,
} from "../api/tmdb-api"
import { useGlobalContext } from "../App"
import Card from "../components/Card"
import Image from "../components/Image"
import Loading from "../components/Loading"
import Section from "../components/Section"
import Slider from "../components/slider/Slider"
import TrailerModal from "../components/TrailerModal"
import { Cast, Film as FilmInterface, Trailer } from "../interfaces"
import { MediaType } from "../types"
import { tmdbImageSrc, youtubeThumbnail } from "../utils"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
// import { saveToFavorites } from "../api/backend-api"
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  mediaType: MediaType
}

const Film = (props: Props) => {
  const axiosBackendPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const location = useLocation()
  const { id } = useParams<any>()
  const navigate = useNavigate()
  const globalContext = useGlobalContext()
  const [film, setFilm] = useState<FilmInterface | null | undefined>(null)

  const [trailerSrc, setTrailerSrc] = useState<string>("")

  const playTrailer = async (key: string) => {
    setTrailerSrc(`https://www.youtube.com/embed/${key}?autoplay=0`)
  }

  const [casts, setCasts] = useState<Cast[]>([])
  const [trailers, setTrailers] = useState<Trailer[]>([])
  const [recommendations, setRecommendations] = useState<FilmInterface[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

  const fetch = async () => {
    const film = await getDetail(props.mediaType, parseInt(id as string))

    if (film) {
      setFilm(film)
      setCasts(await getCasts(film.mediaType, film.id))
      setTrailers(await getTrailers(film.mediaType, film.id))
      setRecommendations(await getRecommendations(film.mediaType, film.id))
    }
  }

  const deleteFavorite = async (filmId: number, mediaType: MediaType) => {
    try {
      const res = await axiosBackendPrivate.delete(`/favorites/${filmId}`)
      return res.data
    } catch (error: any) {
      console.error(error)
    }
  }

  const saveToFavorites = async (filmId: number, mediaType: MediaType) => {
    try {
      const res = await axiosBackendPrivate.post("/favorites", {
        filmId,
        mediaType,
      })
      return res.data
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleFavoriteToggle = async (id: number, mediaType: MediaType) => {
    setIsFavorite((prevState) => !prevState)
    if (isFavorite) {
      const res = await deleteFavorite(id, mediaType)
    } else {
      const res = await saveToFavorites(id, mediaType)
    }
  }

  useEffect(() => {
    setFilm(undefined)
    fetch()
  }, [location])

  if (film === null) {
    return <></>
  } else if (film === undefined) {
    return (
      <div className="text-center p-6 h-full flex-1">
        <Loading></Loading>
      </div>
    )
  }

  return (
    <>
      <TrailerModal
        onHide={() => setTrailerSrc("")}
        src={trailerSrc}
      ></TrailerModal>
      {/* background */}
      <div className="h-[300px] left-0 right-0 top-0 relative">
        <div className="overlay-film-cover"></div>
        <Image src={tmdbImageSrc(film.coverPath)}></Image>
      </div>
      {/* poster */}
      <Section className="-mt-[150px] flex items-center relative z-10 mobile:block">
        <Image
          src={tmdbImageSrc(film.posterPath)}
          className="w-[150px] min-w-[200px] h-[300px] mobile:mx-auto"
        ></Image>
        <div className="px-3 flex flex-col items-start gap-3">
          <p className="text-xl line-clamp-1">{film.title}</p>
          <ul className="flex items-center gap-3 ">
            {film.genreIds.map((id, i) => (
              <li key={i} className="px-3 py-1.5 bg-primary rounded-lg text-sm">
                {
                  globalContext.genres[film.mediaType]?.find(
                    (genre) => genre.id === id
                  )?.name
                }
              </li>
            ))}
            {auth?.user &&
              (isFavorite ? (
                <AiFillHeart
                  size={24}
                  onClick={() => handleFavoriteToggle(film.id, film.mediaType)}
                  className="cursor-pointer text-red-500"
                />
              ) : (
                <AiOutlineHeart
                  size={24}
                  onClick={() => handleFavoriteToggle(film.id, film.mediaType)}
                  className="cursor-pointer"
                />
              ))}
          </ul>
          <p className="line-clamp-3 opacity-[0.9]">{film.description}</p>
        </div>
      </Section>
      {/* cast */}
      <Section title="Casts" hidden={casts.length === 0}>
        <div className="scrollbar scrollbar-thumb-primary scrollbar-track-header overflow-y-auto">
          <div className="flex items-center mb-3">
            {casts.map((cast, i) =>
              cast.profilePath ? (
                <div className="flex-shrink-0 w-[200px] mb-6" key={i}>
                  <Card
                    withPlay={false}
                    imageSrc={tmdbImageSrc(cast.profilePath)}
                  >
                    <p className="font-semibold">{cast.name}</p>
                    <p className="opacity-[0.9] text-sm truncate">
                      {cast.characterName}
                    </p>
                  </Card>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        </div>
      </Section>
      {/* trailers */}
      <Section title="Trailers" hidden={trailers.length === 0}>
        <div className="scrollbar scrollbar-thumb-primary scrollbar-track-header overflow-y-auto">
          <div className="flex items-center gap-3 h-[300px]">
            {trailers.map((trailer, i) => (
              <Card
                onClick={() => playTrailer(trailer.key)}
                imageSrc={youtubeThumbnail(trailer.key)}
                className="flex-shrink-0"
                key={i}
              ></Card>
            ))}
          </div>
        </div>
      </Section>
      {/* seasons */}
      <Section title="Seasons" hidden={film.seasons.length === 0}>
        <Slider
          slidesToShow={film.seasons.length > 2 ? 2 : 1}
          slidesToScroll={film.seasons.length > 2 ? 2 : 1}
          swipe={false}
        >
          {(_) =>
            film.seasons.map((season, i) => (
              <Card
                className="h-[300px]"
                onClick={() =>
                  navigate(`/tv/${film.id}/season/${season.seasonNumber}`)
                }
                title={season.name}
                imageSrc={tmdbImageSrc(season.posterPath)}
                key={i}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* recommendations */}
      <Section title="Recommendations" hidden={recommendations.length === 0}>
        <Slider isMovieCard={true}>
          {(_) =>
            recommendations.map((film, i) => (
              <Card
                onClick={() => navigate(`/${props.mediaType}/${film.id}`)}
                title={film.title}
                key={i}
                imageSrc={tmdbImageSrc(film.posterPath)}
              ></Card>
            ))
          }
        </Slider>
      </Section>
    </>
  )
}

export default Film
