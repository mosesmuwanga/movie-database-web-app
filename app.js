//Import data and libraries
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override'); //for editing
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratagy = require('passport-local');
const User = require('./models/user');

//Import Routes
const movieRoutes = require('./routes/movies');
const peopleRoutes = require('./routes/people');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//Instance of express
const app = express();

//Body parser
//for parsing appllication/json
app.use(express.json());
//for parsing application/x-ww-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//for editing
app.use(methodOverride('_method'));
//Serves all the files in public directory
app.use(express.static(path.join(__dirname, 'public')));

//Set ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //extra security
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //conversion
        maxAge: 1000 * 60 * 60 * 24 * 7 //conversion - a week from now
    }
}

app.use(session(sessionConfig));
app.use(flash());

//Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function (req, res, next) {
    res.locals.currentUser = req.user;
    if (req.user) {
        try {
            const user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
            res.locals.notifications = user.notifications.reverse();
        } catch (err) {
            console.log(err.message);
        }
    }
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/people', peopleRoutes);
app.use('/movies/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

//Connect database
mongoose.connect('mongodb://localhost:27017/mdb', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database is connected.')
});


//get home page
app.get('/home', (req, res) => {
    res.render('home')
})

//404 for every path
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//Other errors
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Uh oh, something went wrong!'
    res.status(statusCode).render('error', { err });
})

//Open port
app.listen(3000, () => {
    console.log("Serving on port 3000.")
})
