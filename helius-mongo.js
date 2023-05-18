import express from 'express';
import save from './save.js';
const app = express();
const port = 4000;

app.use(express.json());

app.post('/', (req, res) => {
    const payload = req.body;
    const nftType = payload[0].events.nft.type;
    const source = payload[0].source;
    const buyer = payload[0].events.nft.buyer;
    const seller = payload[0].events.nft.seller;
    const price = payload[0].events.nft.amount;
    const mint = payload[0].events.nft.nfts[0].mint;
    const description = payload[0].description;

    if (nftType && source && price && mint) {
        const forwardedPayload = {
            type: nftType,
            mint: mint,
            source: source,
            price: price,
            timestamp: Date.now(),
        };

        if (buyer) {
            forwardedPayload.buyer = buyer;
        }

        if (seller) {
            forwardedPayload.seller = seller;
        }

        if (description) {
            forwardedPayload.description = description;
        }

        save('helius', 'nfts', forwardedPayload)
        res.json(forwardedPayload);
    } else {
        res.status(400).json({ error: 'Invalid payload or missing fields.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
