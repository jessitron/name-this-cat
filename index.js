const express = require('express');
const crypto = require('crypto');
const child_process = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

const CHARACTERS_THAT_FIT_ON_THE_IMAGE = 30;

app.post('/name', (req, res) => {
    const catName = req.body.name;

    if (!/[a-zA-Z]/.test(catName) || catName.length > CHARACTERS_THAT_FIT_ON_THE_IMAGE) {
        res.status(400).send("I don't like that name");
        return;
    }

    const outputName = hashOfName(catName);
    const arguments = convertImageToImageWithText(catName, outputName);
    console.log("Running: " + arguments);
    child_process.execFile("convert", arguments,
        (err, stdout, stderr) => {
            console.error(stderr);
            res.redirect("/?picture=" + outputName);
        });
});

app.get('/catPicture', (req, res) => {
    const catName = req.query.name;

    if (!catName) {
        res.status(400).send("Please specify 'name' as a URL parameter")
    }

    const outputName = hashOfName(catName);
    const arguments = convertImageToImageWithText(catName, outputName);
    console.log("Running: " + arguments);
    child_process.execFile("convert", arguments,
        (err, stdout, stderr) => {
            console.error(stderr);
            res.redirect("/output-images/" + outputName + ".jpg");
        });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function hashOfName(catName) {
    return crypto.createHash('SHA1').update(catName).digest('hex');
}

function convertImageToImageWithText(catName, outputName) {
    const inputPath = "public/images/pixie.jpg";
    const outputPath = "public/output-images/" + outputName + ".jpg"
    return [
        inputPath,
        "-gravity", "south",
        "-stroke", "#000C",
        "-strokewidth", "2",
        "-pointsize", "100",
        "-font", "StayPuft",
        "-annotate", "0",
        catName,
        "-stroke", "none",
        "-fill", "white",
        "-annotate", "0",
        catName,
        outputPath
    ];
}