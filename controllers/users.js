const User = require('../models/user');
const Review = require('../models/review');
const Movie = require('../models/movie');
const Notification = require('../models/notification');
const catchAsync = require('../utilities/catchAsync');


module.exports.allUsers = catchAsync(async (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const users = await User.find({
            $or: [
                { username: regex },
            ]
        });
        res.render('users/allUsers', { users });
    }
    else {
        const users = await User.find({});
        res.render('users/allUsers', { users });
    }
});

module.exports.signupForm = (req, res) => {
    res.render('users/signup')
};

module.exports.signup = catchAsync(async (req, res) => {
    try {
        const { username, password, photo, account, bio } = req.body;
        const user = new User({ username, photo, account, bio });
        if (req.body.account === 'contributing') {
            user.isContributing = true;
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, error => {
            if (error) return next(error);
            req.flash('success', `Welcome to the Movie Database ${user.username}!`);
            res.redirect('/movies');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
});

module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Successfully logged out!');
    res.redirect('back');
};

module.exports.profile = catchAsync(async function (req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(req.params.id).populate('following').populate('followers').exec();
        const movies = await Movie.find({}).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
        res.render('users/profile', { user, movies });
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
});


module.exports.editUserForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user)
    if (!user) {
        req.flash('error', 'Sorry, we couldn\'t find that user.');
        return res.redirect('/users');
    }
    res.render('users/edit', { user })

})

module.exports.updateUser = catchAsync(async (req, res) => {
    User.findById(req.params.id, function (error, user) {
        user.bio = req.body.bio;
        user.photo = req.body.photo;
        user.account = req.body.account;
        if (user.account === 'contributing') {
            user.isContributing = true;
        } else {
            user.isContributing = false;
        }
        user.save();
    })
    req.flash('success', `Successfully updated your profile ${req.user.username}!`);
    res.redirect(`/users/${req.user._id}`);
});

module.exports.follow = catchAsync(async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        user.followers.push(req.user._id);
        user.save();
        let followingUser = await User.findById(req.user._id);
        followingUser.following.push(req.params.id);
        followingUser.save();
        req.flash('success', 'Successfully followed ' + user.username + '!');
        res.redirect('back');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
});

module.exports.unfollow = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        user.followers.pull(req.user._id);
        user.save();
        let followingUser = await User.findById(req.user._id);
        followingUser.following.pull(req.params.id);
        followingUser.save();
        req.flash('success', 'Successfully unfollowed ' + user.username + '!');
        res.redirect('back');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

// handle notification
module.exports.notify = async function (req, res) {
    try {
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect('/allNotifications');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

// view all past notifications
module.exports.notifications = async function (req, res) {
    try {
        let user = await User.findById(req.user._id).populate({ path: 'notifications', options: { sort: { "_id": -1 } } }).exec();
        let allNotifications = user.notifications;
        res.render('allNotifications', { allNotifications });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};






