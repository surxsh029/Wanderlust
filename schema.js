const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(), // Adjust length validation if needed
        image: Joi.object({
            filename: Joi.string().optional(),
            url: Joi.string().uri().required(),
        }).allow(null),
    }).required(),
});
