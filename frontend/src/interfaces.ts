import { MediaType } from "./types"

export interface CustomComponentProps {
  children?: React.ReactNode
  className?: string
}

export interface Episode {
  id: number
  title: string
  overview: string
  airDate: string
  stillPath: string
  episodeNumber: number
}

export interface Season {
  id: number
  filmName: string
  name: string
  seasonNumber: number
  posterPath: string
  episodes: Episode[]
  airDate: string
}

export interface Film {
  id: number
  mediaType: MediaType
  title: string
  description: string
  posterPath: string
  coverPath: string
  genreIds: number[]
  seasons: Season[]
}

export interface Cast {
  id: number
  name: string
  characterName: string
  profilePath: string
}

export interface Trailer {
  id: number
  key: string
}

export interface Genre {
  id: number
  name: string
}

export interface LoginFormData {
  username: string
  password: string
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string
}

export interface Favorite {
  filmId: number
  mediaType: MediaType
  title: string // Include the 'title' property from Film
  description: string // Include the 'description' property from Film
  posterPath: string
}
