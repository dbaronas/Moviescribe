import { Genre } from "./interfaces"

export type MediaType = "movie" | "tv"

export type Genres = {
  [key in MediaType]: Genre[]
}
