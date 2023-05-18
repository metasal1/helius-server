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
                source: body?.body[0]?.source,
                description: body?.body[0]?.description,
                signature: body?.body[0]?.signature,
                buyer: body?.body[0]?.events.nft.buyer,
                seller: body?.body[0]?.events.nft.seller,
                price: body?.body[0]?.events.nft.price,
                type: body?.body[0]?.events.nft.type,
                nft: body?.body[0]?.events.nft.nfts[0].mint
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
