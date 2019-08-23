const express = require("express");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./routes/contactRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("website/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "website", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);
//im testing this fork thing... don't mind me im just looking for where you added your redirects for social media
