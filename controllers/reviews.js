const Review = require('../models/review');
const Movie = require('../models/movie');
const User = require('../models/user');
const Notification = require('../models/notification');
const catchAsync = require('../utilities/catchAsync');

module.exports.createReview = catchAsync(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    movie.reviews.push(review);
    await review.save();
    await movie.save();
    const user = await User.findById(req.user._id).populate('followers').exec();
    const newNotification = { username: req.user.username, reviewID: review.id }
    for (const follower of user.followers) {
        const notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save()
        console.log('FOLLOWER' + follower);
    }
    req.flash('success', 'Successfully created review!');
    res.redirect(`/movies/${movie._id}`);

})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/movies/${id}`);
})