'use strict';

const imgTools = {
    contrastImage: (imgData, contrast) => { //input range [-100..100]
        var d = imgData.data;
        contrast = (contrast / 100) + 1; //convert to decimal & shift range: [0..2]
        var intercept = 128 * (1 - contrast);
        for (var i = 0; i < d.length; i += 4) { //r,g,b,a
            d[i] = (d[i] * contrast) + intercept;
            d[i + 1] = (d[i + 1] * contrast) + intercept;
            d[i + 2] = (d[i + 2] * contrast) + intercept;
        }
        return imgData;
    }
};

exports = module.exports = imgTools;