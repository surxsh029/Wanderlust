const Joi = require("joi");
    module.exports.listingSchema = Joi.object({
        listing: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            location: Joi.string().required(),
            country: Joi.string().required(),
            image: Joi.object({
                filename: Joi.string().optional(),
                url: Joi.string()
                    .uri()
                    .allow("") // Allow empty strings
                    .default("https://www.komandoo.com/wp-content/uploads/2022/05/KOM_Jacuzzi-beach-villa_Aerial-18_1600x900.jpg") // Set a default value
                    .optional(),
            }).optional(),
        }).required(),
    });
