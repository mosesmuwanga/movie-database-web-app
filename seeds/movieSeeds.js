const mongoose = require('mongoose');
const Movie = require('../models/movie');
const Person = require('../models/person');
const User = require('../models/user');
const { movies, people, users } = require('./movie-data-short');


mongoose.connect('mongodb://localhost:27017/mdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database is connected.')
});


const seedDB = async () => {
    await Movie.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const rand = Math.floor(Math.random() * 13);
        const movie = new Movie({
            author: '5fbadaa8ed7848105e778436',
            title: `${movies[i].Title}`,
            year: `${movies[i].Year}`,
            runtime: `${movies[i].Runtime}`,
            rating: `${movies[i].Metascore}`,
            plot: `${movies[i].Plot}`,
            poster: `${movies[i].Poster}`,
            rated: `${movies[i].Rated}`,
            //genre: `${genres[i].Genre}`,
            // actors: `${movies[i].Actors}`,
            // directors: `${movies[i].Director}`,
            // writers: `${movies[i].Writer}`,
            imdbRating: `${movies[i].imdbRating}`,
            date: `${movies[i].Released}`,
            country: `${movies[i].Country}`
        })
        await movie.save();
    }

    await Person.deleteMany({});
    for (let i = 0; i < 10; i++) {
        // const rand = Math.floor(Math.random() * 15);
        const person = new Person({
            author: '5fbadaa8ed7848105e778436',
            name: `${people[i].name}`,
            role: `${people[i].role}`,
            photo: `${people[i].photo}`
        })
        await person.save();
    }

    await User.deleteMany({});
    for (let i = 0; i < 6; i++) {
        const user = new User({
            author: '5fbadaa8ed7848105e778436',
            username: `${users[i].username}`,
            password: `${users[i].password}`,
            photo: `${users[i].photo}`,
            isContributing: `${users[i].isContributing}`,
        })
        await user.save();
    }

}



seedDB().then(() => {
    mongoose.connection.close()
})
