require('dotenv').config();

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = {
    optimization: {
        minimize: isProduction
    }
};
