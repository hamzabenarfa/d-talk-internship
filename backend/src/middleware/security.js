const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

const setSecurityMiddleware = (app) => {
    // Apply security headers
    app.use(helmet());

    // Rate limiting middleware
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000 // limit each IP to 1000 requests per windowMs
    });
    app.use(limiter);

    // Sanitize inputs
    app.use(xss());
};

module.exports = setSecurityMiddleware;