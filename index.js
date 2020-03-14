const express = require('express')
const app = express()
const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('public'))
app.use(express.urlencoded());

app.post('/name', (req, res) =>

    res.send('The cat will be named: ' + req.body.name))

// goal:
// convert images/pixie.jpg -gravity south -stroke '#000C' -strokewidth 2 -pointsize 100 -font StayPuft -annotate 0 "Pixie" -stroke none -fill white -annotate 0 "Pixie"  output-images/pixie.jpg

app.listen(port, () => console.log(`Example app listening on port ${port}!`))