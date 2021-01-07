const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');

router.get('/', users.allUsers);

router.get('/signup', users.signupForm);

router.post('/signup', users.signup);

router.get('/login', users.loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout);

router.get('/users/:id', users.profile);

//form for editing user
router.get('/:id/edit', isLoggedIn, users.editUserForm);

//update user
router.put('/:id', isLoggedIn, users.updateUser);

router.get('/follow/:id', isLoggedIn, users.follow);

router.get('/unfollow/:id', isLoggedIn, users.unfollow);

router.get('/notifications/:id', isLoggedIn, users.notify);

router.get('/notifications', isLoggedIn, users.notifications);

module.exports = router;
