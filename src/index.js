const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const cors = require("cors");
const fetch = require("node-fetch");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const app = express();

// ROUTERS

// const apartmentRouter = require('./resources/apartment/router')

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Enables the OPTIONS request check in our API
const movieRouter = express.Router();

// releaseDate String
//   genre       String
//   title       String
//   overview    String
//   poster      String
//   duration    String   @default("100 mins")
// https://image.tmdb.org/t/p/w342/

const generalGere = ["Adventure", "Fantasy", "Romance", "Comedy", "Tradgedy"];
const showTime = ["90 mins", "100 mins", "120 mins"];

// async function seedMovies(res, req) {
//   const movieResult = await fetch(
//     "https://api.themoviedb.org/3/movie/popular?api_key=d214ecb9bda367118385bcbdb9cd776f&language=en-US&page=2"
//   )
//     .then((resp) => resp.json())
//     .then((movies) => {
//       const modifiedMovies = movies.results.map((movie) => {
//         const newMovie = {
//           releaseDate: movie.release_date,
//           genre: generalGere[Math.floor(Math.random() * generalGere.length)],
//           title: movie.title,
//           overview: movie.overview,
//           poster: `https://image.tmdb.org/t/p/w342${movie.backdrop_path}`,
//           duration: showTime[Math.floor(Math.random() * showTime.length)],
//         };
//         return newMovie;
//       });

//       return modifiedMovies;
//     });

//   const finalResult = await db.movie.createMany({
//     data: movieResult,
//   });
//   res.json(finalResult);
// }

movieRouter.get("/", async (req, res) => {
  const movieResult = await fetch(
    "https://api.themoviedb.org/3/movie/popular?api_key=d214ecb9bda367118385bcbdb9cd776f&language=en-US&page=1"
  )
    .then((resp) => resp.json())
    .then((movies) => {
      const modifiedMovies = movies.results.map((movie) => {
        const newMovie = {
          releaseDate: movie.release_date,
          genre: generalGere[Math.floor(Math.random() * generalGere.length)],
          title: movie.title,
          overview: movie.overview,
          poster: `https://image.tmdb.org/t/p/w342${movie.backdrop_path}`,
          duration: showTime[Math.floor(Math.random() * showTime.length)],
        };
        return newMovie;
      });

      return modifiedMovies;
    });

  const finalResult = await db.movie.createMany({
    data: movieResult,
  });
  res.json(movieResult);
});

app.get("*", movieRouter);

//CONNECT THE SERVER
app.listen(3030, () => {
  console.log("The server is connected!");
});
