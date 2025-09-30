const express = require("express");
const request = require("request");
const path = require("path");
const app = express();

// ✅ serve js/ folder
app.use(express.static(__dirname));

// ✅ serve parent folder (report/)
app.use(express.static(path.join(__dirname, "..")));

app.get("/proxy", (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing url param");

  request(targetUrl)
    .on("response", (proxyRes) => {
      delete proxyRes.headers["x-frame-options"];
      delete proxyRes.headers["content-security-policy"];
    })
    .pipe(res);
});

app.listen(3000, () => {
  console.log("Proxy running at http://localhost:3000");
});
