import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { search } from "../api/tmdb-api"
import { useGlobalContext } from "../App"
import { Film } from "../interfaces"
import { tmdbImageSrc } from "../utils"
import Image from "./Image"

interface Props {
  keyword: string
  goToSearchPage: Function
}

const SearchResult = ({ keyword, goToSearchPage }: Props) => {
  const [items, setItems] = useState<Film[]>([])
  const [totalItems, setTotalItems] = useState(6)
  const searchTimeout = useRef<any>("")

  const globalContext = useGlobalContext()
  const navigate = useNavigate()

  const fetch = async () => {
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      const res = await search(keyword)
      setTotalItems(res.totalPages)
      setItems(res.films)
    }, 120)
  }

  useEffect(() => {
    fetch()
  }, [keyword])

  return (
    <div
      className="
          absolute
          top-[48px]
          left-0
          right-0
          rounded-md
          bg-header
          shadow-lg
        "
    >
      <div className="max-h-[480px] scrollbar scrollbar-thumb-primary scrollbar-track-header overflow-y-auto pr-3">
        {items.map((film, i) => (
          <div
            key={i}
            className="flex items-start p-1.5 rounded-lg hover:bg-primary custom-pointer m-1.5"
            onClick={() => navigate(`/${film.mediaType}/${film.id}`)}
          >
            <Image
              src={tmdbImageSrc(film.posterPath)}
              className="h-[72px] w-[102px] min-w-[102px] rounded-md"
            ></Image>
            <div className="px-3 truncate">
              <p className="text-base truncate">{film.title}</p>
              <ul className="flex flex-wrap gap-x-1.5 text-sm opacity-[0.7]">
                {film.genreIds.map((id, i) => (
                  <li key={i}>
                    {
                      globalContext.genres[film.mediaType].find(
                        (genre) => genre.id === id
                      )?.name
                    }{" "}
                    {i !== film.genreIds.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {totalItems > 5 ? (
        <button
          onClick={() => goToSearchPage()}
          className="px-3 py-1.5 bg-primary w-full hover:text-body sticky bottom-0 shadow-lg rounded-md"
        >
          More results
        </button>
      ) : (
        ""
      )}
    </div>
  )
}

export default SearchResult
