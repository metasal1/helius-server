import express from 'express';
import save from './save.js';
const app = express();
const port = 4000;

app.use(express.json());

app.post('/', (req, res) => {
    const payload = req.body;
    const nftType = payload.body[0].events.nft.type;
    const source = payload.body[0].source;
    const buyer = payload.body[0].events.nft.buyer;
    const seller = payload.body[0].events.nft.seller;
    const price = payload.body[0].events.nft.amount;
    const mint = payload.body[0].events.nft.nfts[0].mint;

    if (nftType && source && price && mint) {
        const forwardedPayload = {
            type: nftType,
            mint: mint,
            source: source,
            price: price,
        };

        if (buyer) {
            forwardedPayload.buyer = buyer;
        }

        if (seller) {
            forwardedPayload.seller = seller;
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
