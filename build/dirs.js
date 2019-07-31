const path = require('path');
console.log('path: ', __dirname);

module.exports = {
    home: path.resolve(__dirname, "../"),
    src: path.resolve(__dirname, "../", "src"),
    dist: path.resolve(__dirname, "../dist"),
}