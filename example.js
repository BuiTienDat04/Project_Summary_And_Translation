const cheerio = require('cheerio');

// ...existing code...

// Example usage of cheerio
const html = '<html><head></head><body><h1>Hello, world!</h1></body></html>';
const $ = cheerio.load(html);
console.log($('h1').text()); // Output: Hello, world!

// ...existing code...
