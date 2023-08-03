# Moviescribe
Description:

Moviescribe is a movie website that utilizes the external API TMDB (The Movie Database) to provide an immersive movie browsing experience. Moviescribe enables users to explore an extensive collection of films, complete with detailed information, captivating posters, and trailers.

Functionalities:

Home page: Browse trending movies and TV shows.
Movie and TV pages: Explore random movies or TV shows.
Search: Find movies by their names.
Sign In page: Allows users to log in or redirects them to the Sign Up page.
Logout: Terminates the session of logged-in users.
Favorite Movies:

Only authenticated users can save a movie to their favorites list. However, this feature works for "In Theaters" movies only. By clicking on the heart icon, it will turn red, indicating that the movie has been saved to the favorites list. To remove the movie from the favorites list, click on the heart icon again. If the page is refreshed for a movie that has been saved previously, the heart icon will not be red (due to incomplete state management for this icon).

Technical Decisions:

Initial access tokens are stored in the app state. Putting them in cookies or local storage would allow JavaScript to access them. Thus, storing refresh tokens in an HTTP-only cookie enables the token to be sent back to the refresh endpoint (handled by the backend server) to recognize the user and obtain a new access token.

Instructions:

Primarily, install node modules: npm i
Include your project details in .env
Start the project: npm run start or npm run dev
To obtain access for usage of the TMDB API, create an account at (https://developer.themoviedb.org/reference/intro/getting-started). Then attach your access token in tmdb-api.tsx file for axiosClient (Bearer <Your access token>).
All TMDB API endpoints can be found there by using search: (https://developer.themoviedb.org/docs)
