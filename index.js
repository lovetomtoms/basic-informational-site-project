const http = require("http");
// const url = require("node:url");
const fs = require("fs").promises;

const host = "localhost";
const port = 8000;

let htmlFiles;

const requestListener = (req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const reqUrl = new URL(req.url, baseURL);
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(render(reqUrl));
};

const render = (url) => {
  let file;
  switch (url.pathname) {
    case "/":
      file = htmlFiles[0].toString();
      break;
    case "/about":
      file = htmlFiles[1].toString();
      break;
    case "/contact":
      file = htmlFiles[2].toString();
      break;
    default:
      file = htmlFiles[3].toString();
  }
  return file;
};

const index = fs.readFile(__dirname + "/index.html");
const about = fs.readFile(__dirname + "/about.html");
const contact = fs.readFile(__dirname + "/contact-me.html");
const badConnection = fs.readFile(__dirname + "/404.html");

Promise.all([index, about, contact, badConnection])
  .then((values) => {
    htmlFiles = values;
    // console.log(htmlFiles.toString());
    server.listen(port, host, () => {
      console.log(`Server is  running on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error(`Could not read index.html file: ${err}`);
    process.exit(1);
    return;
  });

const server = http.createServer(requestListener);
