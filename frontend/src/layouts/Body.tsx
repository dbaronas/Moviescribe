import { Route, Routes } from "react-router-dom"
import Catalog from "../pages/Catalog"
import Season from "../pages/Season"
import Film from "../pages/Film"
import Home from "../pages/Home"
import Authentication from "../pages/Authentication"
import Favorites from "../pages/Favorites"
import RequireAuth from "../components/RequireAuth"

const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Authentication type="Sign In" />}></Route>
      <Route path="/register"element={<Authentication type="Sign Up" />}></Route>

      <Route element={<RequireAuth />}>
        <Route path="/favorites" element={<Favorites />}></Route>
        <Route path="/favorites/movie/:id" element={<Film mediaType="movie" />}></Route>
      </Route>

      <Route path="/movies" element={<Catalog type="movie" />}></Route>
      <Route path="/tv" element={<Catalog type="tv" />}></Route>
      <Route path="/search" element={<Catalog type="search" />}></Route>
      <Route path="/list/:listTitle" element={<Catalog type="list" />}></Route>
      <Route path="/movie/:id" element={<Film mediaType="movie" />}></Route>
      <Route path="/tv/:id" element={<Film mediaType="tv" />}></Route>
      <Route path="/tv/:id/season/:seasonNumber" element={<Season />}></Route>
    </Routes>
  )
}

export default Body
