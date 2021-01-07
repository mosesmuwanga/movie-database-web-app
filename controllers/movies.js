const Movie = require('../models/movie');
const Person = require('../models/person');
const User = require('../models/user');
const Notification = require('../models/notification');
const catchAsync = require('../utilities/catchAsync');

module.exports.allMovies = catchAsync(async (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const movies = await Movie.find({
            $or: [
                { title: regex },
                { genre: regex },
                { directors: regex },
                { writers: regex },
                { actors: regex },
                { 'author.username': regex }
            ]
        });
        res.render('movies/allMovies', { movies });
    }
    else {
        const movies = await Movie.find({});
        res.render('movies/allMovies', { movies });
    }
})

module.exports.newMovieForm = (req, res) => {
    res.render('movies/new')
}

module.exports.createMovie = catchAsync(async (req, res, next) => {
    const movie = new Movie(req.body.movie);
    movie.author = req.user._id;
    await movie.save();
    req.flash('success', `Successfully added ${movie.title} to the MVDB!`);
    res.redirect(`/movies/${movie._id}`);
})

module.exports.showMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    const movies = await Movie.find({});
    const people = await Person.find({});
    if (!movie) {
        req.flash('error', 'Sorry, we couldn\'t find that movie.');
        return res.redirect('/movies');
    }
    var allScores = [];
    movie.reviews.forEach(function (score) {
        allScores.push(score.score);
    });

    if (allScores.length === 0) {
        movie.avgScore = 0;
    } else {
        var scores = allScores.reduce(function (total, score) {
            return total + score;
        })
        movie.avgScore = (Math.round((scores / movie.reviews.length) * 100) / 100).toFixed(2);
        movie.scoreCount = movie.reviews.length;
    }
    movie.save()
    res.render('movies/movie', { movie, movies, people });
})

module.exports.editMovieForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    const movies = await Movie.find({});
    const people = await Person.find({});
    console.log(people)
    if (!movie) {
        req.flash('error', 'Sorry, we couldn\'t find that movie.');
        return res.redirect('/movies');
    }

    res.render('movies/edit', { movie, people })

})

module.exports.updateMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, { ...req.body.movie });
    const movies = await Movie.find({});
    const people = await Person.find({});
    req.flash('success', `Successfully updated ${movie.title}!`);
    res.redirect(`/movies/${movie._id}`);
})

module.exports.deleteMovie = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted movie!');
    res.redirect('/movies');
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};