'use strict';

const fn = {
    submit: () => {
        document.querySelector('form').submit();
    },
    imgSubmit: img => {
        const file = img.files[0],
            reader = new FileReader();
        reader.onload = () => {
            ((base64Img = reader.result) => {
                document.querySelector('input[name=url]').value = base64Img;
            })();
        }
        reader.readAsDataURL(file);

    },
    getDataUri: (url, callback) => {
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);

            // Get raw image data
            callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }
};

window.fn = fn;