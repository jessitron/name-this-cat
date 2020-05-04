const express = require('express');
const crypto = require('crypto');
const child_process = require('child_process');
const CatName = require('./CatName')
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

app.post('/name', (req, res) => {
    const catName = new CatName(req.body.name);

    createNamedCatPicture(catName, (err, outputName) => {
        res.redirect("/?picture=" + outputName);
    });
});

/**
 * 
 * @param {CatName} catName name to place on picture
 * @param {function(err, outputName: string): void} cb called with an error or the outputName of new picture
 */
function createNamedCatPicture(catName, cb) {
    const outputName = hashOfName(catName.text);
    const arguments = convertImageToImageWithText(catName.text, outputName);
    console.log("Running: " + arguments);
    child_process.execFile("convert", arguments,
        (err, stdout, stderr) => {
            console.error(stderr);
            cb(err, outputName);
        });
}

app.get('/catPicture', (req, res) => {
    const nameText = req.query.name;

    if (!nameText) {
        res.status(400).send("Please specify 'name' as a URL parameter")
    }

    createNamedCatPicture(new CatName(nameText), (err, outputName) => {
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