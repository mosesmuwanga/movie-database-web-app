const { movieSchema, reviewSchema, personSchema } = require('./schemas');
const Movie = require('./models/movie');
const Review = require('./models/review');
const Person = require('./models/person');
const ExpressError = require('./utilities/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Sorry, you must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isValidMovie = (req, res, next) => {
    const result = movieSchema.validate(req.body);
    console.log(result)
    const { error } = movieSchema.validate(req.body);
    if (error) {
        const message = error.details.map(elelment => elelment.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

module.exports.isMovieAuthor = async (req, res, next) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/movies/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/movies/${id}`);
    }
    next();
}

module.exports.isValidPerson = (req, res, next) => {
    const { error } = personSchema.validate(req.body);
    if (error) {
        const message = error.details.map(elelment => elelment.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

module.exports.isPersonAuthor = async (req, res, next) => {
    const { id } = req.params;
    const person = await Person.findById(id);
    if (!person.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/people/${id}`);
    }
    next();
}

module.exports.addPerson = async (req, res, next) => {
    const { id, actors, directors, writers } = req.params;
    const movie = await Movie.findById(id);
    if (!movie.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/movies/${id}`);
    }
    next();
}