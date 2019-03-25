const express = require("express");
const app = express();
const port = 8080;

app.use("/public", express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname }/views/index.html`);
});

app.listen(port, () => console.log(`Navega a http://localhost:${port} para ver la app.`));