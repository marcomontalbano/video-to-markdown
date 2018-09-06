module.exports = {
    plugins: [
        require('posthtml-include')({
            root: require('path').join(__dirname, 'src')
        })
    ]
};
