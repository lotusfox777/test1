const express = require('express');
const path = require('path');
const compression = require('compression');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const useHttps = process.env.HTTPS === 'true';

let credentials = {};

if (useHttps) {
  credentials = {
    key: fs.readFileSync(
      process.env.SSL_KEY ||
        '/etc/dehydrated/certs/trackerdplusweb.openlife.co/privkey.pem',
      'utf8',
    ),
    cert: fs.readFileSync(
      process.env.SSL_CERT ||
        '/etc/dehydrated/certs/trackerdplusweb.openlife.co/fullchain.pem',
      'utf8',
    ),
  };
}

app.use(compression());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = useHttps
  ? https.createServer(credentials, app)
  : http.createServer(app);

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`dplus dashboard server is running on ${port} port`);
});
