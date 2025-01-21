const router = require('express').Router();
const movieController = require('./movieRoutes');
const Watchlist = require("../models/Watchlist")
const withAuth = require('../utils/auth');
router.get('/movie/:id', movieController.getMovieDetails);
router.get('/search/', movieController.getSearchResults);
const axios = require('axios');
const API_KEY = 'b92f9ace24e14d3e4ad0aecc18146092';
// checks if user is authorized 

router.get('/', withAuth, async (req, res) => {

    console.log("check this", req.session, req.session.user_id)
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=27&sort_by=vote_count.desc&api_key=${API_KEY}`);
        const movies = response.data.results.filter(movie => movie.poster_path !== null).slice(0, 20);

        res.render('homepage', {
            title: 'Top Rated Horror Movies', movies,
            user_id: req.session.user_id,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// renders about page
router.get('/about.handlebars', async (req, res) => {
    res.render('about');
});

// renders login page
router.get('/login.handlebars', async (req, res) => {
    res.render('login');
});
// renders reviews page
router.get('/reviews.handlebars', async (req, res) => {
    res.render('reviews');
});
// renders watchlist page
router.get('/watchlist.handlebars', async (req, res) => {
    res.render('watchlist');
});
        //get movie list
        //console.log("is the user in here?",req.session,  req.session.user_id)

/*       try {
        const watchData = await Watchlist.findAll({
           where: {user_id: req.session.user_id}
           
        });

        console.log("what is my watch list?", watchData)
        const w = watchData.map((project) => project.get({ plain: true }));
        console.log("w?",w)

        res.render('watchlist', {
            movies:  w,
            user_id:  req.session.user_id
        });
  
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}); */

// Login route
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;