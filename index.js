const express = require('express');
const crypto = require('crypto');
const child_process = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

app.post('/name', (req, res) => {
    const catName = req.body.name;
    const outputName = hashOfName(catName);
    const command = convertImageToImageWithText(catName, outputName);
    console.log("Running: " + command);
    child_process.exec(command,
        (err, stdout, stderr) => {
            console.error(stderr);
            res.redirect("/?picture=" + outputName);
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function hashOfName(catName) {
    return crypto.createHash('SHA1').update(catName).digest('hex');
}

function convertImageToImageWithText(catName, outputName) {
    const inputPath = "public/images/pixie.jpg";
    const outputPath = "public/output-images/" + outputName + ".jpg"
    return `convert ${inputPath} \
            -gravity south -stroke '#000C' -strokewidth 2 -pointsize 100 \
            -font StayPuft \
            -annotate 0 "${catName}" \
            -stroke none -fill white \
            -annotate 0 "${catName}" \
            ${outputPath}`;
}