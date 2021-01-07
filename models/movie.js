const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    runtime: {
        type: String,
        required: true
    },
    plot: {
        type: String,
        required: true
    },
    avgScore: Number,
    scoreCount: Number,
    genre: [
        {
            type: String,
            enum: [
                'Action', 'Adventure', 'Anamation', 'Comedy', 'Crime',
                'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
                'Romance', 'Thriller', 'Western'
            ]
        }
    ],
    actors: [String],
    directors: [String],
    writers: [String],
    poster: String,
    rated: {
        type: String,
        enum: [
            'G', 'PG', 'PG-13', 'R'
        ]
    },
    date: String,
    imdbRating: String,
    country: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ]
});

movieSchema.post('findOneAndDelete', async function (item) {
    if (item) {
        await Review.deleteMany({
            _id: {
                $in: item.reviews
            }
        })
    }
})

module.exports = mongoose.model('Movie', movieSchema);


