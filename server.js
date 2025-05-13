const http = require("http");
const https = require("https");
const app = require('./app');

const isHttps = process.env.HTTPS ? process.env.HTTPS : false;

let server;

if (isHttps) {
  const credentials = {
    key: fs.readFileSync("/var/www/html/api/https/privkey.pem"),
    cert: fs.readFileSync("/var/www/html/api/https/fullchain.pem"),
  };

  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

server.listen(process.env.PORT || 7000);

server.on("listening", () => {
  console.log(
    `server running : http://${process.env.HOST}:${process.env.PORT}`
  )
});