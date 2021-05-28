function API(request, response) {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://admin:admin@bank.v5c9f.mongodb.net/bank?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
                            response.writeHead(200, {
                                'Set-Cookie': `login=${insertres.login}; HttpOnly`,
                                'Set-Cookie': `password=${insertres.password}; HttpOnly`
                            });
                            response.end(JSON.stringify(insertres.ops[0]));
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
                        response.writeHead(200, {
                            'Set-Cookie': `login=${findres.login}; HttpOnly`,
                            'Set-Cookie': `password=${findres.password}; HttpOnly`
                        });
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
}

module.exports = API;
