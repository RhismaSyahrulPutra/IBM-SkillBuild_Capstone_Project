const http = require("http");
const { handleRequest } = require("./controller");

// Create server and attach handler
const server = http.createServer(handleRequest);

// Listen on port 3000
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
