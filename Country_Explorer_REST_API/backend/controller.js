const path = require("path");
const fs = require("fs");

// import service
const { fetchCountries } = require("./countries-services");

// READ AND SERVE FUNCTION
function readAndServe(filePath, extname, res) {
  filePath = decodeURIComponent(filePath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
    return;
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error: " + error.code);
    } else {
      let contentType = getContentType(extname);

      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
}

// CONTENT TYPE
function getContentType(extname) {
  let contentType = "";

  switch (extname) {
    case ".html":
      contentType = "text/html";
      break;

    case ".js":
      contentType = "text/javascript";
      break;

    case ".css":
      contentType = "text/css";
      break;

    case ".png":
      contentType = "image/png";
      break;

    case ".svg":
      contentType = "image/svg+xml";
      break;

    case ".json":
      contentType = "application/json";
      break;
  }

  return contentType;
}

// HANDLE REQUEST
function handleRequest(req, res) {
  let filePath = "." + req.url;

  // default route
  if (filePath === "./") {
    filePath = "./index.html";
  }

  // detail route
  else if (filePath.startsWith("./detail.html")) {
    filePath = "./detail.html";
  }

  // ✅ COUNTRIES API ROUTE
  else if (filePath === "./countries" && req.method === "GET") {
    fetchCountries()
      .then(function (data) {
        // success response
        if (data) {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(JSON.stringify(data));
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Response data is null");
        }
      })
      .catch(function (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Failed to fetch data");
      });

    return;
  }

  // static file handling
  const extname = path.extname(filePath);

  if (extname) {
    readAndServe(filePath, extname, res);
  }
}

// EXPORT
module.exports = {
  handleRequest,
};
