var path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'build/bundle.js',
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'es6'),
                loader: 'babel-loader',
            },
        ],
    },
};
