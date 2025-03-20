const express = require("express");

const PORT = 3000 || process.env.PORT;

const app = express();

// Routes
app.get("/", (req, res) => {
  res.send("Hello Root-n-Routes");
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
