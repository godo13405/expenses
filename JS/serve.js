'use strict';

const fs = require('fs'),
    serve = {
        api: body => {

        },
        static: (req, res) => {
            let filePath = `./www${req.url}`;
            if (filePath === './www/') {
                filePath = './www/index.html';
            }

            fs.readFile(filePath, (error, content) => {
                if (error) {
                    // eslint-disable-next-line no-console
                    if (global.isDev) console.log(chalk.red('invalid URL'), chalk.blue(filePath));
                }
                res.setHeader('Content-Type', serve.getContentType(req.url));
                res.end(content, 'utf-8');
            });
        },
        getContentType: input => {
            input = input.split('.');
            input = input[input.length - 1];
            let output = 'text/html';
            switch (input) {
                case 'js':
                    output = 'text/javascript';
                    break;
                case 'css':
                    output = 'text/css';
                    break;
                case 'json':
                    output = 'application/json';
                    break;
                case 'svg':
                    output = 'image/svg+xml';
                    break;
                case 'png':
                    output = 'image/png';
                    break;
                case 'jpg':
                    output = 'image/jpg';
                    break;
                case 'wav':
                    output = 'audio/wav';
                    break;
                default:
                    break;
            }

            return output;
        },
    };

exports = module.exports = serve;