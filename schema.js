const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required().min(0),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string().uri().required(),
        }).allow(null),
    }).required()
})