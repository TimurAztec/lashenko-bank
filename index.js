const PORT = process.env.PORT || 80;
const http = require('http');
const fs = require('fs');
const API = require('./api');

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    if (request.url === '/') {
        fs.readFile('front/index.html', (err, data) => {
            response.write(data);
            response.end();
        });
    } else if (request.url.split('/')[1] === 'api') {
        API(request, response);
    } else {
        fs.readFile(`${__dirname}/front${request.url}`, function (err,data) {
            if (err) {
                response.writeHead(404);
                response.end(JSON.stringify(err));
                return;
            }
            response.writeHead(200);
            response.end(data);
        });
    }
}).listen(PORT);

console.log('Server started on: ' + PORT);
