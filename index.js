const express = require('express');

const app = express();

app.get("/cacheable", (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.json({ status: "OK" });
});

app.get("/uncacheable", (req, res) => {
  res.json({ status: "OK" });
});

app.all("/", async (req, res) => {
  res.json({"status": "OK"});
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port", port);
});
