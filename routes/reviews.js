const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor, isValidReview } = require('../middleware');
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, reviews.createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;