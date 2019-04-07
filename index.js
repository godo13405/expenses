'use strict';

const fs = require("fs"),
    uuid = require('uuid/v1');

const fn = {
    api: async body => {
        // eslint-disable-next-line no-console
        console.log('starting cloud vision 👀');
        // Imports the Google Cloud client library
        const vision = require('@google-cloud/vision');

        // let's temporarily store the image
        const data = body.replace(/^data:image\/[a-z]*;base64,/, ""),
            image = new Buffer(data, 'base64'),
            // path = `./tmp/${uuid()}.jpg`;
            path = `./tmp/tmp.jpg`;

        fs.writeFileSync(path, image);
        // eslint-disable-next-line no-console
        console.log('created file ', path);

        // Creates a client
        const client = new vision.ImageAnnotatorClient();

        // Performs label detection on the image file
        const [result] = await client.textDetection(path);
        // const [result] = await client.labelDetection(path);
        const output = fn.read(result);
        return output;
    },
    read: read => {
        const text = read.textAnnotations,
            fullText = text[0].description.split('\n'),
            cropBox = text[0].boundingPoly.vertices;

        // console.log('text:', text);

        // let's go through the pieces of text, see if we can identify some key things
        let findings = {
                box: cropBox,
                body: {
                    Products: []
                }
            },
            paid = 100000;
        for (let x = 0; x < fullText.length; x++) {
            const elem = fullText[x];
            console.log('x:', x, elem);
            if (elem.match(/^date/i)) {
                findings.body.Date = elem.replace(/^date[:\s]*/i, '')
            } else if (elem.match(/^[0-9]*[\s]*x[\s]*/i)) {
                findings.body.Products.push(elem.replace(/^[0-9]*[\s]*x*[\s]*/i, ''));
            } else if (elem.match(/^(debit|credit) [a-z]*(:)/i)) {
                paid = x + 1;
            } else if (x === paid) {
                findings.body.Paid = elem;
            }
        }
        // console.log('read:', fullText);

        // console.log('findings:', findings);

        return findings;
    }
};

exports.expenses = async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    res.set('Access-Control-Allow-Origin', 'https://godo13405.github.io/expenses/');
    res.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Authorization');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        let output = await fn.api(req.body);
        output = JSON.stringify(output);
        res.end(output);
    }
};