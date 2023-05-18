import http from 'http';
import https from 'https';
import save from './save.js';

const port = 4000; // the port on which the server will listen

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());

            // transform the payload to suit the Discord webhook format
            const payload = {
                marketplace: 'magiceden',
                collection: 'lily',
                buyer: body[0]?.accountData[0]?.account,
                seller: body[0]?.accountData[1]?.account,
                price: body[0]?.nativeTransfers[0],
                description: body[0]?.description
            };

            // save to MongoDB

            save('helius', 'helius', payload)
            // send a response to the client
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'POST');
        res.end('Method not allowed');
    }
});

server.listen(port, () => {
    console.log(`Helius to Mongo Server running at http://localhost:${port}/`);
});
