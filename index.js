const express = require('express');
const crypto = require('crypto');
const csp = require('helmet-csp')
const child_process = require('child_process');
const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    let pictureLocation = "images/pincho.jpg";
    const catPictureFilename = req.query["picture"];
    if (catPictureFilename) {
        pictureLocation = `output-images/${catPictureFilename}.jpg`;
    }
    res.send(populateIndex(pictureLocation));
});

app.post('/name', (req, res) => {
    const catName = req.body.name;
    res.cookie("catName", catName); // gratuitously set cookie

    createNamedCatPicture(catName, (err, outputName) => {
        res.redirect("/?picture=" + outputName);
    });
});


function createNamedCatPicture(catName, cb) {
    const outputName = hashOfName(catName);
    const arguments = convertImageToImageWithText(catName, outputName);
    console.log("Running: " + arguments.join(" "));
    child_process.execFile("convert", arguments,
        (err, stdout, stderr) => {
            console.error("Convert says: " + stderr);
            cb(err, outputName);
        });
}

const bodyParser = require('body-parser');
app.use(bodyParser.json({
    type: ['json', 'application/csp-report']
}));
app.post('/csp-report', (req, res) => {
    console.log("CSP Report: " + JSON.stringify(req.body, null, 2));
    res.send("Thanks");
})


app.listen(port, () => console.log(`Name This Cat on port ${port}!`))

function hashOfName(catName) {
    return crypto.createHash('SHA1').update(catName).digest('hex');
}

function convertImageToImageWithText(catName, outputName) {
    const inputPath = "public/images/pincho.jpg";
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


function populateIndex(catPictureFilename) {
    return `<html>
  
    <head>
        <link rel="stylesheet" href="styles.css">
    </head>
    
    <body>
        <h1>Name This Cat</h1>
        <main>
        <form action="name" method="post" class="form-example">
            <div class="form-example">
                <label for="name">Enter a name for the cat: </label>
                <input type="text" name="name" id="name" required>
            </div>
        </form>
        <img id="picture" class="catpicture" src="${catPictureFilename}">
        </main>
    </body>
    <script src="gratuitouslySetStorage.js"></script>
    </html>`
}