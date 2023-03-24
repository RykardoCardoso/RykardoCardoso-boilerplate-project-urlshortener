require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

/** APP **/

/** 

{
"original_url": "https://www.google.com",
"short_url": 1
}

*/

let urlShorted = [];
let urlCount = 0;

app.use(express.urlencoded({ extended: true }));

// short function
app.post('/api/shorturl/', (req, res) => {
  let url = req.body.url;

  let findValue = urlShorted.find(obj => obj.short_url == url);

  if (url.indexOf('http') >= 0) {
    if (typeof findValue == typeof undefined) {
      urlCount++;

      urlShorted.push({
        'original_url': url,
        'short_url': urlCount
      });

      res.json({
        'original_url': url,
        'short_url': urlCount
      });

      console.log(urlShorted);
    } else {
      res.json(findValue);
    }
  } else {
    res.json({ error: 'invalid url' });
  }

});

// usage
app.get("/api/shorturl/:short_url", function(req, res) {
  let findedValue = urlShorted.find(obj => obj.short_url == req.params.short_url);
  //console.log("finded Value: ", findedValue);
  if (typeof findedValue == typeof undefined) {
    res.json({ error: 'invalid url' });
  } else {
    res.redirect(findedValue['original_url']);
  }
  //res.json({ 'echo': req.params.short_url });
});


//load some assets
app.use("/public", express.static(__dirname + "/public"));

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
