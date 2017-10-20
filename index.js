const path = require('path')
const express = require('express');
const app = express()
const server = require('http').createServer(app);
const cheerio = require('cheerio')
var rp = require('request-promise');

const io = require('socket.io')(server);
const fs = require('fs');
var nunjucks = require('nunjucks');
const ADRUINO_IP = 'http://192.168.0.105'

app.set('view engine', 'twig');
app.set('twig options', {
    strict_variables: false
});

app.use('/static', express.static('assets'))
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.set('views', './views');


app.get('/', async (req,res) => {
  return res.render('services')
})

app.get('/info', async (req,res) => {
  try {
    let htmlString = await rp({
      method : 'GET',
      url : ADRUINO_IP,
      timeout: 6000
    });
    const $ = cheerio.load(htmlString);
    let an1 = $("#an1").text()
    let an2 = $("#an2").text()
    let an3 = $("#an3").text()
    let an4 = $("#an4").text()
    let an5 = $("#an5").text()
    return res.json({ an1, an2, an3, an4, an5 })
  } catch(e) {
    const $ = cheerio.load(e);
    let an1 = $("#an1").text()
    let an2 = $("#an2").text()
    let an3 = $("#an3").text()
    let an4 = $("#an4").text()
    let an5 = $("#an5").text()
    return res.json({ an1, an2, an3, an4, an5 })
  }
})

// app.get('/click/:buttonName', (req,res) => {
//
// })

app.use((req,res) => {
  res.redirect('/')
})
// app.get('/', (req,res) => {
// 	res.sendFile(path.join(__dirname, 'neos/index.html'))
// });

io.on('connection', function (socket) {
  socket.emit('send-sms', { phone: '01687446686', content: 'gjodfjglkfdjglfjdlgjfdlkjg' });
  socket.on('out_of_cash', function (data) {
    console.log('out_of_cash' + data);
  });

  socket.on('error-sms', function (data) {
    console.log('errorSMS ' + data);
  });
});



app.use('/:fileName', (req,res) => {
	if(!req.params.fileName) return res.status(404).send('Not Found')
	return res.sendFile(path.join(__dirname + '/neos/', req.params.fileName))
})


server.listen(8000, function(){ console.log ('App is running at port 8000')});
