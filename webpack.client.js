require('dotenv').config();

module.exports = {
    module: {
        rules: [{
            test: /\.(jpg|jpeg|png|gif|ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [{
            loader: 'file-loader'
            }]
        }]
    },
    devServer: {
        contentBase: require('path').join(__dirname, 'dist/client'),
        proxy: {
            '/.netlify': {
                target: 'http://localhost:8081',
                pathRewrite: { '^/.netlify/functions': '' }
            }
        }
    }
};
