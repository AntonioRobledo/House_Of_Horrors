const axios = require('axios');
const API_KEY = 'b92f9ace24e14d3e4ad0aecc18146092';

const getMovieDetails = async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&with_genres=27&sort_by=vote_count.desc`);
    const movie = response.data;
    res.render('movie', { title: movie.title, movie });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Something went wrong' });
  }
};

const getSearchResults = async (req, res) => {
  const query = req.query.query;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?page=1&sort_by=vote_average.desc&api_key=${API_KEY}&language=en-US&query=${query}`);
    const movies = response.data.results.filter(movie => movie.poster_path !== null).slice(0, 20);
    res.render('searchResult', { title: 'Search Results', movies, query });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'No movies with that title were found' });
  }}

module.exports = {getMovieDetails, getSearchResults };
