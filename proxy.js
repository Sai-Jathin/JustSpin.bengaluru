// proxy.js — run with: node proxy.js
// Sits between your frontend and Google Places API to avoid CORS issues.
// Keep this running alongside your app.

const express = require('express');
const axios   = require('axios');
const cors    = require('cors');

const app = express();
app.use(cors());

const GOOGLE_API_KEY = 'AIzaSyD9kjS1DrUVPWb4gi7Blj1vvEIK7oEwf50';

// GET /nearby?lat=12.97&lng=77.64&type=hospital
app.get('/nearby', async (req, res) => {
    const { lat, lng, type } = req.query;

    if (!lat || !lng || !type) {
        return res.status(400).json({ error: 'lat, lng and type are required' });
    }

    const allowedTypes = ['hospital', 'pharmacy', 'gas_station'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
            + `?location=${lat},${lng}`
            + `&rankby=distance`
            + `&type=${type}`
            + `&key=${GOOGLE_API_KEY}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
    console.log(`   Test: http://localhost:${PORT}/nearby?lat=12.97&lng=77.64&type=hospital`);
});