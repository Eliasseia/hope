const express = require('express');
const ffmpeg = require('../ffmpeg/ffmpeg');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/overlay', async (req, res) => {
    const { video1, video2 } = req.body;

    if (!video1 || !video2) {
        return res.status(400).send('Both video1 and video2 URLs are required.');
    }

    try {
        const result = await ffmpeg.overlayVideos(video1, video2);
        res.json({ videoUrl: result });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
