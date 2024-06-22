const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

async function downloadVideo(url, filePath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function overlayVideos(video1Url, video2Url) {
    const video1Path = path.join(__dirname, `${uuidv4()}.mp4`);
    const video2Path = path.join(__dirname, `${uuidv4()}.mp4`);
    const outputPath = path.join(__dirname, `${uuidv4()}.mp4`);

    try {
        await downloadVideo(video1Url, video1Path);
        await downloadVideo(video2Url, video2Path);

        return new Promise((resolve, reject) => {
            ffmpeg(video1Path)
                .input(video2Path)
                .complexFilter([
                    {
                        filter: 'overlay',
                        options: { x: 0, y: 0 }
                    }
                ])
                .output(outputPath)
                .on('end', () => resolve(outputPath))
                .on('error', reject)
                .run();
        });
    } finally {
        fs.unlink(video1Path, () => {});
        fs.unlink(video2Path, () => {});
    }
}

module.exports = {
    overlayVideos
};
