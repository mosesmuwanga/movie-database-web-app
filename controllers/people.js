const Person = require('../models/person');
const User = require('../models/user');
const Movie = require('../models/movie');
const Notification = require('../models/notification');
const catchAsync = require('../utilities/catchAsync');

module.exports.allPeople = ('/people', catchAsync(async (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const people = await Person.find({
            $or: [
                { name: regex },
                { role: regex }
            ]
        });
        res.render('people/allPeople', { people });
    }
    else {
        const people = await Person.find({});
        res.render('people/allPeople', { people });
    }
}));

module.exports.newPersonForm = ('/people/new', (req, res) => {
    res.render('people/new');
});

module.exports.addPerson = ('/people', catchAsync(async (req, res) => {
    const person = new Person(req.body.person);
    person.author = req.user._id;
    await person.save();
    req.flash('success', `Successfully added ${person.name} to the MVDB!`);
    res.redirect(`/people/${person._id}`)
}));

module.exports.showPerson = ('/people/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const person = await Person.findById(id).populate('author');
    const people = await Person.find({});
    const movies = await Movie.find({});
    if (!person) {
        req.flash('error', 'Sorry, we couldn\'t find that person.');
        return res.redirect('/people');
    }
    res.render('people/person', { person, people, movies });
}));

module.exports.editPersonForm = ('/people/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const person = await Person.findById(id);
    if (!person) {
        req.flash('error', 'Sorry, we couldn\'t find that person.');
        return res.redirect('/people');
    }
    res.render('people/edit', { person });
}));

module.exports.updatePerson = ('/people/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const person = await Person.findByIdAndUpdate(id, { ...req.body.person });
    req.flash('success', `Successfully updated ${person.name}!`);
    res.redirect(`/people/${person._id}`);
}));

module.exports.follow = ('/follow/:id', catchAsync(async function (req, res) {
    const { id } = req.params;
    const person = await Person.findById(id);
    person.save();
    console.log(person)
}));


module.exports.deletePerson = catchAsync(async (req, res) => {
    const { id } = req.params;
    const person = await Person.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${person.name} from the MVDB!`);
    res.redirect('/people');
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};