'use strict';

const fn = {
    submit: data => {
        fetch('./', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                // mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    // "Content-Type": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: data // body data type must match "Content-Type" header
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                console.log('API response: ', JSON.stringify(myJson));
            });
    },
    imgSubmit: img => {
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

                    const ratio = 800 / largest;

                    let data = fn.imageToDataUri(img, width * ratio, height * ratio);
                    fn.submit(data);
                }
            }
        }
    },
    imageToDataUri: (img, width = 800, height = 800) => {
        // create an off-screen canvas
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;

        // draw source image into the off-screen canvas:
        ctx.drawImage(img, 0, 0, width, height);

        document.querySelector('body').appendChild(canvas);
        document.querySelector('body').classList.add('canvas');

        // encode image to data-uri with base64 version of compressed image
        return canvas.toDataURL();
    }
};

window.fn = fn;