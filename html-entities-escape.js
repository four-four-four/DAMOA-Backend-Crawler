const { decode } = require('html-entities');

function decoding(string){
    return decode(string).replaceAll('<b>', '').replaceAll('</b>','');
}
module.exports = {
    decoding
}