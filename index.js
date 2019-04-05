'use strict';

const fs = require("fs"),
    uuid = require('uuid/v1');

const serve = require('./JS/serve.js'),
    fn = {
        api: async body => {
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
            const [result] = await client.textDetection(path);
            // const [result] = await client.labelDetection(path);
            const output = fn.read(result);
            return output;
        },
        read: read => {
            const text = read.textAnnotations,
                fullText = text[0].description.split('\n');

            // let's go through the pieces of text, see if we can identify some key things
            let findings = {
                products: []
            };
            fullText.forEach(x => {
                if (x.match(/^date/i)) {
                    findings.date = x.replace(/^date[:\s]*/i, '')
                } else if (x.match(/^[0-9]*[\s]*x[\s]*/i)) {
                    findings.products.push(x.replace(/^[0-9]*[\s]*x*[\s]*/i, ''));
                } else if (x.match(/^(debit|credit) [a-z]*(\:)/i)) {
                    findings.paid = x.replace(/^(debit|credit)[a - z]*(\:)/i, '');
                }
            });
            // console.log('read:', fullText);
            // console.log('findings:', findings);

            return findings;
        }
    };

exports.expenses = async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');

    let output = await fn.api(req.body);
    output = JSON.stringify(output);
    res.end(output);
};