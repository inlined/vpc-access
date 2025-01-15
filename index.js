const express = require('express');
const bodyParser = require('body-parser');
const Memcached = require('memcached');

if (!process.env.MEMCACHE_ADDR) {
  console.error("MEMCACHE_ADDR must be set");
  process.exit(1);

}

const cache = new Memcached(process.env.MEMCACHE_ADDR);

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  cache.get("value", (err, data) => {
    if (err) {
      console.error("Failed to fetch cache value:", err);
      res.status(500).send(err);
      return;
    }
    console.log("GOT", JSON.stringify(data, null, 2));
    res.send(data);
  });
});

app.post("/", (req, res) => {
  console.log("Setting value to", req.body);
  cache.set("value", req.body, 3600, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("OK");
    }
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Listening on port", port);
});
