import http from 'http';
import https from 'https';

const port = 3000; // the port on which the server will listen
const webhookUrl = 'https://discord.com/api/webhooks/1105308385714388992/IGgk71psksih_cMPCyGPFq0YtWgbRl1hLYqJPxEB1v0ABHG_z_dbyxMQkizBxTjzKbrs'; // the Discord webhook URL

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());

            // transform the payload to suit the Discord webhook format
            const payload = {
                content: body[0].description,
                embeds: [
                    {
                        title: 'Transaction Details',
                        fields: [
                            {
                                name: 'From Account',
                                value: body[0].accountData[0].account,
                                inline: true,
                            },
                            {
                                name: 'To Account',
                                value: body[0].accountData[1].account,
                                inline: true,
                            },
                            {
                                name: 'Amount',
                                value: `${body[0].nativeTransfers[0].amount / 1000000000} SOL`,
                                inline: true,
                            },
                        ],
                    },
                ],
            };

            // send the payload to the Discord webhook
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const req = https.request(webhookUrl, options, (res) => { });
            req.write(JSON.stringify(payload));
            req.end();

            // send a response to the client
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Message sent to Discord webhook');
        });
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'POST');
        res.end('Method not allowed');
    }
});

server.listen(port, () => {
    console.log(`Helius to Discord Server running at http://localhost:${port}/`);
});
