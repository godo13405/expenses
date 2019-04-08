/* eslint-disable no-process-env */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */

'use strict';

const fn = {
    submit: (data, imgArgs) => {
        let q = new URLSearchParams("https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8&q=mdn%20query%20string")
        q = q.get('source');
        let apiUrl = 'https://europe-west1-expenses-236607.cloudfunctions.net/expenses';
        // let apiUrl = 'https://fn.expenses.goncaloandrade.com/expenses';
        if (window.location.hostname === 'localhost' || window.location.hostname.match('/serveo.net/gi')) {
            apiUrl = './';
        } else if (q === 'local') {
            apiUrl = 'https://expenses.serveo.net';
        }
        fetch(apiUrl, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "include", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: data // body data type must match "Content-Type" header
            })
            .then(response => {
                return response.json();
            })
            .then(x => {
                document.querySelector('body').classList.remove('busy');
                document.querySelector('body').classList.add('result');

                const canvas = fn.canvasCrop({
                    imgArgs,
                    startX: x.box[0].x,
                    startY: x.box[0].y,
                    newWidth: x.box[1].x - x.box[0].x,
                    newHeight: x.box[2].y - x.box[1].y
                });
                document.querySelector('.image').appendChild(canvas);

                fn.outputResult(x.body);
            });
    },
    outputResult: data => {
        let body = '';
        for (const x in data) {
            body += `<label class="read-item ${x.toLowerCase()}"><span class="label">${x}</span><span class="value" contenteditable="true">${data[x]}</span></label>`;
        }
        document.querySelector(`.read-container .inner`).innerHTML = body;
    },
    imgSubmit: img => {
        document.querySelector('body').classList.remove('initial');
        document.querySelector('body').classList.add('busy');
        const file = img.files[0];
        var reader = new FileReader();
        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                let img = new Image();
                img.src = evt.target.result;
                img.onload = function () {
                    let height = img.height,
                        width = img.width,
                        largest = height;

                    // what's the orientation?
                    if (height <= width) {
                        largest = width;
                    }

                    const ratio = 800 / largest,
                        imgArgs = {
                            img,
                            width: width * ratio,
                            height: height * ratio
                        },
                        canvas = fn.canvasInit(imgArgs),
                        data = canvas.toDataURL();

                    fn.submit(data, imgArgs);
                }
            }
        }
    },
    canvasCrop: ({
        imgArgs,
        startX,
        startY,
        newWidth,
        newHeight,
        ratioW = imgArgs.width / newWidth,
        ratioH = imgArgs.height / newHeight
    }) => {
        /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
        //set up canvas for thumbnail
        var tnCanvas = document.createElement('canvas');
        var tnCanvasContext = tnCanvas.getContext('2d');
        tnCanvas.width = newWidth;
        tnCanvas.height = newHeight;

        /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
        var bufferCanvas = document.createElement('canvas');
        var bufferContext = bufferCanvas.getContext('2d');
        bufferCanvas.width = imgArgs.width;
        bufferCanvas.height = imgArgs.height;
        bufferContext.drawImage(imgArgs.img, 0, 0, imgArgs.width, imgArgs.height);

        /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
        tnCanvasContext.drawImage(bufferCanvas, startX, startY, imgArgs.width, imgArgs.height, 0, 0, newWidth * ratioW, newHeight * ratioH);
        return tnCanvas;
    },
    canvasInit: ({
        img,
        width = 800,
        height = 800
    }) => {
        // create an off-screen canvas
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;

        // draw source image into the off-screen canvas:
        ctx.drawImage(img, 0, 0, width, height);

        return canvas;
    }
};

window.fn = fn;