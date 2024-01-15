import React, { useEffect, useState } from 'react'
import axios from 'axios'
import YouTube from 'react-youtube'
import './App.css'

function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = 'b9f63323a6229118bc8995cb80b07073'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'

  // images
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  // State variables
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")

  const [trailer, setTrailer] = useState(null)
  const [movie, setMovie] = useState({ title: "Loading Movies" })
  const [playing, setPlaying] = useState(false)

  // Function to perform a GET request to the API
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results)
    setMovie(results[0])

    if (results.length) {
      await fetchMovie(results[0].id)
    }
  };

  // Function to request a single object and display it in a video player
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    // const data = await fetchMovie(movie.id)
    // console.log(data);
    // setSelectedMovie(movie)
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // Function to search for movies
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className='title'>Movies</h2>
      {/* Search  */}
      <form className="form" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder=""
          onChange={(e) => setSearchKey(e.target.value)}
          />
        <button className="btn">Search</button>
      </form>
       
      {/* Container for the banner and video player */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="videoplayer container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 1,
                        cc_load_policy: 0,
                        fs: 1,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                        volume: 50,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="button">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="button"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* Container that will display movie posters */}
      <div className='container'>
        
          {movies.map((movie) => (
            <div key={movie.id} class='movie-card' onClick={() => selectMovie(movie)}>
            <img src={`${URL_IMAGE + movie.poster_path}`} alt="" />
              <h4>{movie.title}</h4>
            </div>
          ))}
        
      </div>
    </div>
  );
}

export default App
