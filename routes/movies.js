const express = require('express');
const router = express.Router();
const movies = require('../controllers/movies');
const { isLoggedIn, isMovieAuthor, /*isValidMovie*/ } = require('../middleware');


//get and render all the movies in the database
router.get('/', movies.allMovies);

//form for creating a new movie
router.get('/new', isLoggedIn, movies.newMovieForm);

//create a new movie, then redirect to the new movies page
router.post('/', isLoggedIn, /*isValidMovie,*/ movies.createMovie);

//show an indivdual movie
router.get('/:id', movies.showMovie);

//form for editing a movie
router.get('/:id/edit', isLoggedIn, movies.editMovieForm);

//put req for updating movie after editing
router.put('/:id', isLoggedIn, /*isValidMovie,*/ movies.updateMovie);

//delete a movie
router.delete('/:id', isLoggedIn, isMovieAuthor, movies.deleteMovie);

module.exports = router;