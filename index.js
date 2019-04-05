'use strict';

const serve = require('./JS/serve.js');

exports.expenses = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    let output = serve.api(req.body);
    res.end(JSON.stringify(output));
};