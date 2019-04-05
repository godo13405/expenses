'use strict';

const fs = require("fs"),
    uuid = require('uuid/v1');

const serve = require('./JS/serve.js'),
    api = async body => {
        console.log('starting cloud vision 👀');
        // Imports the Google Cloud client library
        const vision = require('@google-cloud/vision');

        // let's temporarily store the image
        const data = body.replace(/^data:image\/[a-z]*;base64,/, ""),
            image = new Buffer(data, 'base64'),
            // path = `./tmp/${uuid()}.jpg`;
            path = `./tmp/tmp.jpg`;

        fs.writeFileSync(path, image);
        console.log('created file ', path);

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs label detection on the image file
        const [result] = await client.labelDetection(path);
        const labels = result.labelAnnotations;
        console.log('Labels:');
        labels.forEach(label => console.log(label.description));
    };

exports.expenses = (req, res) => {
    console.log('api reached');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    let output = api(req.body);
    res.end(JSON.stringify(output));
};