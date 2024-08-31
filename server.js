const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const shortId = require("shortid");
var favicon = require('serve-favicon');
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended:false}))
app.use(favicon(__dirname + '/views/favicon.ico')); 
mongoose.connect('mongodb://127.0.0.1:27017/urlShortner',{
    useNewUrlParser: true, useUnifiedTopology: true
})
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl, short: shortId.generate()})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) =>{
    const shortUrl= await ShortUrl.findOne({ short : req.params.shortUrl});
    if(shortUrl== null){
        return res.sendStatus(404)
    }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000);
