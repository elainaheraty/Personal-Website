const express = require("express");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./routes/contactRoutes")(app);

const port = process.env.port || 5000;
app.listen(port);
