const express = require('express');
const crypto = require('crypto');
const child_process = require('child_process');
const app = express();
const port = 3000;

// app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'))
app.use(express.urlencoded());

app.post('/name', (req, res) => {
    const catName = req.body.name;
    const outputName = hashOfName(catName);
    // goal:
    // convert images/pixie.jpg -gravity south -stroke '#000C' -strokewidth 2 -pointsize 100 -font StayPuft -annotate 0 "Pixie" -stroke none -fill white -annotate 0 "Pixie"  output-images/pixie.jpg

    res.redirect("/?picture=" + outputName);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function hashOfName(catName) {
    return crypto.createHash('SHA1').update(catName).digest('hex');
}

function generatePictureWithText(catName, outputPath, cb) {
    const inputPath = "images/pixie.jpg";
    const quotedText = '"' + catName + '"';
    child_process.exec("convert", [
        inputPath,
        "-gravity", "south",
        "-stroke", "'#000C'",
        "-strokewidth", "2",
        "-pointsize", "100",
        "-font", "StayPuft",
        "-annotate 0",
        quotedText,
        "-stroke", "none",
        "-fill", "white",
        "-annotate", "0",
        quotedText,
        outputPath
    ], cb)
}