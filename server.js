'use strict';

// Options
// eslint-disable-next-line no-unused-vars
const endpoint = require('./index.js'),
    serve = require('./JS/serve.js'),
    http = require('http'),
    port = 3000,
    server = http.createServer();

server.on('request', (req, res) => {
    if (req.method === 'GET') {
        serve.static(req, res);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // body = JSON.parse(body) || null;
            endpoint.expenses({
                body
            }, res);
            res.end('ok');
        });
    }
}).
listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port ${port}`);
});