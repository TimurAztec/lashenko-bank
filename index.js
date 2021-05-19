const PORT = process.env.PORT || 80;
const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    if (request.url === '/') {
        fs.readFile('front/index.html', (err, data) => {
            response.write(data);
            response.end();
        });
    }
    else {
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
