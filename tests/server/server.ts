import * as fs from "fs";
import * as http from "http";

import * as debugModule from "debug";
const debug = debugModule("server");

const PORT: number = 3000;

// Send a 404 error
function send404(err: string, url: string, res: http.ServerResponse) {
  debug(`send404: ${err} url=${url}`);
  res.writeHead(404, {
    "charset": "UTF-8",
    "content-type": "text/html",
  });

  // And the content is the url
  res.end(`err:'${err}' url=${url}`);
}

// Create a server and the handler for a few requests
const httpServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  let filePath = `.${req.url}`;
  debug(`filePath='${filePath}'`);
  try {
    fs.stat(filePath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
      if (err) {
        send404(err.toString(), filePath, res);
        return;
      }
      if (!stats.isFile()) {
        send404("File not found", filePath, res);
        return;
      }

      // Write the header
      res.writeHead(200, {
        "charset": "UTF-8",
        "content-type": "text/html",
      });

      // Send filePath as the content
      fs.createReadStream(filePath).pipe(res);
    });
  } catch(err) {
    send404(err, req.url, res);
  }
});

// Start it listening on the desired port
httpServer.listen(PORT, () => {
  debug("Listening on: http://localhost:%s", PORT);

  // Output to stdout a message that we're running
  process.stdout.write(`running PORT=${PORT}`);
});
