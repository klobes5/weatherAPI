var Joi = require('joi');
//validation for measurements
module.exports.add = {
    options: {
        status: 400,
        statusText: 'Error adding measurements'
    },
    body: Joi.object().keys({
        timestamp: Joi.string().required(),
        temperature: Joi.number().precision(1),
        dewPoint: Joi.number().precision(1),
        precipitation: Joi.number().precision(1)
    }).or('temperature', 'dewPoint', 'precipitation')
};
module.exports.get = {
    options: {
        status: 404,
        statusText: 'Measurement does not exist'
    },
    params: {
        timestamp: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/).required()
        
    }
}
module.exports.update = {
    options: {
        status: 400,
        statusText: 'Error updating measurements'
    },
    params: {
        timestamp: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required()
        
    },
    body: {
        timestamp: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required(),
        temperature: Joi.number().precision(1).required(),
        dewPoint: Joi.number().precision(1).required(),
        precipitation: Joi.number().precision(1).required()
    }
}
module.exports.patch = {
    options: {
        status: 400, //update with invalid values
        statusText: 'Error updating measurements'
    },
    params: {
        timestamp: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required()
        
    },
    body: Joi.object().keys({
        timestamp: Joi.string().required(),
        temperature: Joi.number(),
        dewPoint: Joi.number(),
        precipitation: Joi.number()
    }).or('temperature', 'dewPoint', 'precipitation')
}
module.exports.delete = {
    options: {
        status: 404,
        statusText: 'Invalid Date'
    },
    params: {
        timestamp: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required()
        
    }
}
module.exports.stats = {
    options: {
        status: 200, //Will simply return empty body if fails validation
        statusText: ''
    },
    query: { //both stat and metric can either be single value or array
        stat: Joi.alternatives().try(Joi.array().required(), Joi.string().required()),
        metric: Joi.alternatives().try(Joi.array().required(), Joi.string().required()),
        fromDateTime: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required(),
        toDateTime: Joi.string().regex(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z/).required()
    }
}