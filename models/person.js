const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    photo: String,
    role: {
        type: String,
        required: true,
        enum: [
            'Actor', 'Director', 'Writer'
        ]
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    collabs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Person'
        }
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    author: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Person', personSchema);

