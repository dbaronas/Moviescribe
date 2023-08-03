import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getInTheaters,
  getPopulars,
  getTopRated,
  getTrailers,
  getTrendings,
} from "../api/tmdb-api"
import Card from "../components/Card"
import Section from "../components/Section"
import Slider from "../components/slider/Slider"
import TrailerModal from "../components/TrailerModal"
import TrendingHero from "../components/TrendingHero"
import { Film } from "../interfaces"
import { mergeFilms, tmdbImageSrc } from "../utils"

const Home = () => {
  const navigate = useNavigate()
  const [trendings, setTrendings] = useState<Film[]>([])
  const [inTheaters, setInTheaters] = useState<Film[]>([])
  const [populars, setPopulars] = useState<Film[]>([])
  const [topRatedTv, setTopRatedTv] = useState<Film[]>([])
  const [topRatedMovie, setTopRatedMovie] = useState<Film[]>([])
  const [trailerSrc, setTrailerSrc] = useState<string>("")

  const playTrailer = async (film: Film) => {
    const trailers = await getTrailers(film.mediaType, film.id)
    setTrailerSrc(`https://www.youtube.com/embed/${trailers[0].key}?autoplay=0`)
  }

  const fetchTopRatedMovie = async () => {
    const { films } = await getTopRated("movie")
    setTopRatedMovie(films)
  }

  const fetchTopRatedTv = async () => {
    const { films } = await getTopRated("tv")
    setTopRatedTv(films)
  }

  const fetchPopulars = async () => {
    const movies = await getPopulars("movie")
    const tvs = await getPopulars("tv")
    setPopulars(mergeFilms(movies, tvs))
  }

  const fetchInTheaters = async () => {
    setInTheaters(await getInTheaters())
  }

  console.log(inTheaters)

  const fetchTrending = async () => {
    const movies = await getTrendings("movie")
    const tvs = await getTrendings("tv")
    setTrendings(mergeFilms(movies, tvs, 20))
  }

  const goToDetailPage = (film: Film) => {
    navigate(`${film.mediaType}/${film.id}`)
  }

  useEffect(() => {
    fetchTrending()
    fetchInTheaters()
    fetchPopulars()
    fetchTopRatedMovie()
    fetchTopRatedTv()
  }, [])

  return (
    <>
      <TrailerModal
        onHide={() => setTrailerSrc("")}
        src={trailerSrc}
      ></TrailerModal>
      {/* trendings */}
      <Section className="py-0 pt-0" hidden={trendings.length === 0}>
        <Slider
          className="slick-hero"
          autoplay={true}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {(onSwipe) =>
            trendings.map((film, i) => (
              <TrendingHero
                onPlayTrailer={() => playTrailer(film)}
                onClick={() =>
                  !onSwipe ? navigate(`/${film.mediaType}/${film.id}`) : ""
                }
                film={film}
                key={i}
              ></TrendingHero>
            ))
          }
        </Slider>
      </Section>
      <Section title="In Theaters" hidden={inTheaters.length === 0}>
        <Slider isMovieCard={true} autoplay={true}>
          {(_) =>
            inTheaters.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                key={i}
                imageSrc={tmdbImageSrc(film.posterPath)}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* popular */}
      <Section title="What's Popular" hidden={populars.length === 0}>
        <Slider isMovieCard={true} autoplay={true}>
          {(_) =>
            populars.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                key={i}
                imageSrc={tmdbImageSrc(film.posterPath)}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      {/* Top rated TV */}
      <Section
        hidden={topRatedTv.length === 0}
        title="Top Rated TV"
        onTitleClick={() => navigate(`/list/top-rated-tv`)}
      >
        <Slider isMovieCard={true} autoplay={true}>
          {(_) =>
            topRatedTv.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
                title={film.title}
                key={i}
                imageSrc={tmdbImageSrc(film.posterPath)}
              ></Card>
            ))
          }
        </Slider>
      </Section>
      <Section
        hidden={topRatedMovie.length === 0}
        title="Top Rated Movies"
        onTitleClick={() => navigate(`/list/top-rated-movies`)}
      >
        <Slider isMovieCard={true} autoplay={true}>
          {(_) =>
            topRatedMovie.map((film, i) => (
              <Card
                onClick={() => goToDetailPage(film)}
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

export default Home
