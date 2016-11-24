'use strict';

const httpCodes = require('http-codes');

const BaseRoute = require('./base.route');

const util = require('../util/index').util;

const config = require('../config/default.json');
const errors = require('../config/errors.json');

class Unicorn extends BaseRoute {
    constructor(router) {
        super(router);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router
            .route(config.ROUTE.UNICORN_ENDPOINT)
            .post((request, response, next) => {
                let validationErrors;

                request.checkBody('colour', errors.REQUIRED_COLOUR)
                    .notEmpty()
                    .isColourValid()
                    .withMessage(errors.INVALID_COLOUR);

                validationErrors = request.validationErrors();

                if(validationErrors) {
                    return next(util.createError(
                        httpCodes.BAD_REQUEST,
                        util.getExpressValidationErrors(validationErrors)
                    ));
                }

                response.sendStatus(httpCodes.CREATED);
            });
    }
}

module.exports = Unicorn;
