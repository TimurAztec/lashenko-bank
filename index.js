const PORT = process.env.PORT || 80;
const http = require('http');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@bank.v5c9f.mongodb.net/bank?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    if (request.url === '/') {
        fs.readFile('front/index.html', (err, data) => {
            response.write(data);
            response.end();
        });
    } else if (request.url.split('/')[1] === 'api') {
        if (request.url.split('/')[2] === 'signup' && request.method === 'POST') {
            let dataJSONString = '';
            request.on('data', (data) => {
                dataJSONString += data;
            });
            request.on('end', () => {
                const data = JSON.parse(dataJSONString);
                client.connect((err, client) => {
                    if (err) throw err;
                    const collection = client.db('bank').collection('users');
                    collection.findOne({login: data.login}).then((findres) => {
                        if (findres) {
                            response.writeHead(404);
                            response.end(JSON.stringify('Such user already exist'));
                            client.close();
                        } else {
                            collection.insertOne(data).then((insertres) => {
                                response.writeHead(200);
                                response.end(JSON.stringify(insertres));
                            }).finally(() => client.close());
                        }
                    });
                });

            });
        }
        if (request.url.split('/')[2] === 'signin' && request.method === 'POST') {
            let dataJSONString = '';
            request.on('data', (data) => {
                dataJSONString += data;
            });
            request.on('end', () => {
                const data = JSON.parse(dataJSONString);
                client.connect((err, client) => {
                    if (err) throw err;
                    const collection = client.db('bank').collection('users');
                    collection.findOne(data).then((findres) => {
                        if (findres) {
                            response.writeHead(200);
                            response.end(JSON.stringify(findres));
                            client.close();
                        } else {
                            response.writeHead(404);
                            response.end(JSON.stringify('Wrong sign in data!'));
                            client.close();
                        }
                    }).finally(() => {});
                });

            });
        }
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
