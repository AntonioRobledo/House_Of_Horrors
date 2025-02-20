const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const compression = require('compression');
const hbs = exphbs.create({ });
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Review = require("./models/Review");
const Watchlist = require("./models/Watchlist");

const app = express();
const PORT = process.env.PORT || 3001;

// const hbs = exhbs.create({ helpers });

// Set up sessions with cookies
// defining a session object using the session() method
const sess = {
    // secret is a string that is used to sign the session ID cookie
    secret: 'Super secret secret',
    // cookie is an object that contains the cookie settings
    cookie: {},
    // resave: false means that the session will not be resaved if nothing has changed
    resave: false,
    // A boolean that determines whether or not to save an unmodified session to the store
    saveUninitialized: true,
    // a custom session store implemenation that uses Sequelize ORM to persist session data to a database.
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());
app.use(routes);

  app.get("/reviews", async (req, res)=>{
    try{
        const result = await Review.findAll() //need to get all reviews
      
        let formatData = [];

        //iterate through results to find the data
        result.map(r => {
            //i added it to array
            formatData.push(r.dataValues)
        })
    
        console.log("check::",formatData);

        res.render("reviews",{
            allReviews: formatData
        })

    } catch (e){
        console.log("Error", e)
    }
   
  })

  app.post("/api/reviews", async (req, res)=>{
    //req.body.rating
    //req.body.content
    console.log(req.body)
    try{
        const result = await Review.create({
            rating: parseInt(req.body.rating), //parseInt converts str to number
            content: req.body.content
            
        })

        console.log("result", result)

        /* res.json({
            data: result
        }) */
        res.redirect("/reviews")
    } catch (e){
        console.log("error", e)
    }
  })

  app.post("/api/watchlist", async (req, res)=>{
    //req.body.rating
    //req.body.content
    console.log("what did i get?",req.body)
    try{
        const result = await Watchlist.create({
            user_id: parseInt(req.body.user_id),
            movie_id: parseInt(req.body.movie_id),
            movie_title: req.body.movie_title
            
        })

        console.log("result", result)

        /* res.json({
            data: result
        }) */
        res.redirect("/watchlist.handlebars")
    } catch (e){
        console.log("error", e)
    }
  })

  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
  });
