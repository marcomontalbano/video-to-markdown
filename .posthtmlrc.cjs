module.exports = {
    plugins: [
        require('posthtml-include')({
            root: require('path').join(__dirname, 'src')
        }),
        require('posthtml-expressions')({
            locals: {
                NODE_ENV: process.env.NODE_ENV ?? 'undefined',
                GA_TRACKING_ID: process.env.GA_TRACKING_ID ?? 'undefined',
            }
        })
    ]
};
