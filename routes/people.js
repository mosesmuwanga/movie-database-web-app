const express = require('express');
const router = express.Router();
const people = require('../controllers/people');
const { isLoggedIn, isPersonAuthor, isValidPerson } = require('../middleware');


//get and render all the people in the database
router.get('/', people.allPeople);

//form for creating a new person
router.get('/new', isLoggedIn, people.newPersonForm);

//create a new person, then redirect to the new people page
router.post('/', isLoggedIn, people.addPerson);

//show an indivdual person
router.get('/:id', people.showPerson);

//form for editing a person
router.get('/:id/edit', isLoggedIn, people.editPersonForm);

//put req for updating person after editing
router.put('/:id', isLoggedIn, people.updatePerson);

// router.get('/follow/:id', isLoggedIn, people.follow)

// router.get('/unfollow/:id', isLoggedIn, people.unfollow)

//delete a person
router.delete('/:id', isLoggedIn, isPersonAuthor, people.deletePerson);

module.exports = router;