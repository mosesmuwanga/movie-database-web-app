//for validating data
const Joi = require('joi');

// module.exports.movieSchema = Joi.object({
//     movie: Joi.object({
//         title: Joi.string().required(),
//         year: Joi.number().required().min(1900).max(2020),
//         runtime: Joi.string().required(),
//         plot: Joi.string().required(),
//         actors: Joi.string().required(),
//         directors: Joi.string().required(),
//         writers: Joi.string().required()
//     }).required()
// });



// username: Joi.string().alphanum().min(6).max(16).required(),
//     password: Joi.string().regex(/^[a-zA-Z0-9{6,16}$/)

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        score: Joi.number().required().min(0).max(10),
        summary: Joi.string(),
        rev: Joi.string()
    }).required()
})

// module.exports.personSchema = Joi.object({
//     person: Joi.object({
//         name: Joi.string().required(),
//         role: Joi.string().required(),
//         photo: Joi.string()
//     })
// })