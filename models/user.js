const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        //required: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    photo: {
        type: String,
        default: 'https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png?w=640'
    },
    userSince: {
        type: Date,
        default: Date.now()
    },
    bio: String,
    isContributing: {
        type: Boolean,
        default: false
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followingPeople: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Person'
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
});

UserSchema.plugin(passportLocalMongoose); //adds username and password

module.exports = mongoose.model('User', UserSchema);