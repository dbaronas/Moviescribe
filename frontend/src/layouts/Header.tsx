import { useEffect, useState, useRef } from "react"
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"
import { mergeClassName } from "../utils"
import { IoIosSearch } from "react-icons/io"
import Container from "../components/Container"
import SearchResult from "../components/SearchResult"
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const MENU_CLASS = `
 py-1
 px-1.5
 hover:bg-primary
 rounded-md
 mobile:px-6
`

const MENU_CLASS_ACTIVE = `
 bg-primary
`

const Header = () => {
  const { auth, setAuth } = useAuth()
  const axiosBackendPrivate = useAxiosPrivate()
  const location = useLocation()
  const [params, _] = useSearchParams()
  const navigate = useNavigate()

  const [keyword, setKeyword] = useState("")
  const [isSearchFocus, setSearchFocus] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const [pathname, setPathname] = useState("") //represents current URL path
  const pathnameRef = useRef("")
  const defaultKeyword = useRef("")

  const onLogout = async () => {
    try {
      const data = {
        token: auth?.user?.refreshToken,
      }

      const res = await axiosBackendPrivate.delete("/logout", { data })

      if (res.status === 204) {
        setAuth({})
        navigate("/login")
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const goToSearchPage = () => {
    if (keyword) {
      defaultKeyword.current = keyword
      navigate(`/search?q=${keyword}`)
      setSearchFocus(false)
      searchRef.current?.blur()
    }
  }

  const initKeyword = () => {
    if (pathnameRef.current === "/search") {
      setKeyword(defaultKeyword.current)
    } else {
      setKeyword("")
    }
  }

  const onWindowClick = () => {
    setSearchFocus(false)
    initKeyword()
  }

  const getMenuClass = (path: string) => {
    if (path === pathname) {
      return mergeClassName(MENU_CLASS, MENU_CLASS_ACTIVE)
    }
    return mergeClassName(MENU_CLASS, "")
  }

  useEffect(() => {
    setPathname(location.pathname)
    pathnameRef.current = location.pathname
    defaultKeyword.current = params.get("q") || ""
  }, [location.pathname])

  useEffect(() => {
    window.addEventListener("click", onWindowClick)

    return () => {
      window.removeEventListener("click", onWindowClick)
    }
  }, [])

  return (
    <div className="bg-header sticky top-0 z-[99]">
      <Container className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold">
            <Link to={"/"}>Moviescribe</Link>
          </h1>
          <div className="pt-1.5 flex items-center gap-1.5 mobile:fixed mobile:bottom-0 mobile:right-0 mobile:left-0 mobile:justify-center mobile:py-3 mobile:bg-header mobile:gap-6">
            <Link className={getMenuClass("/movies")} to={"/movies"}>
              Movies
            </Link>
            <Link className={getMenuClass("/tv")} to={"/tv"}>
              TV
            </Link>
            {auth?.user ? (
              <>
                <Link className={getMenuClass("/favorites")} to={"/favorites"}>
                  Favorites
                </Link>
                <Link
                  className={getMenuClass("/logout")}
                  onClick={() => onLogout()}
                  to={"/"}
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link className={getMenuClass("/login")} to={"/login"}>
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="border-b-[0.5px] border-white flex items-center p-1 flex-[0.5] focus-within:border-primary relative">
          <input
            onClick={(e) => {
              e.stopPropagation()
              setSearchFocus(true)
            }}
            onKeyDown={(e) => (e.key === "Enter" ? goToSearchPage() : "")}
            onInput={(e) => setKeyword(e.currentTarget.value)}
            value={keyword}
            type="text"
            className="bg-transparent outline-0 flex-1"
            placeholder="search..."
          />
          <IoIosSearch size={18}></IoIosSearch>
          {isSearchFocus ? (
            <SearchResult
              keyword={keyword}
              goToSearchPage={goToSearchPage}
            ></SearchResult>
          ) : (
            ""
          )}
        </div>
      </Container>
    </div>
  )
}

export default Header
