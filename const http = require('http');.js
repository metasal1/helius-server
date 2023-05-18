const http = require('http');
const https = require('https');

const port = 3000; // the port on which the server will listen
const webhookUrl = 'https://discord.com/api/webhooks/your-webhook-url'; // the Discord webhook URL

const server = http.createServer((req, res) => {
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
    const req = https.request(webhookUrl, options, (res) => {});
    req.write(JSON.stringify(payload));
    req.end();

    // send a response to the client
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Message sent to Discord webhook');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
