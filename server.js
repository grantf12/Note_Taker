// Dependencies
// ==================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./db/db.json");
// const stringify = require("querystring");

// Sets up Express App
var app = express();
var PORT = process.env.PORT || 8000;

// Sets up express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Sets up Express to serve static files
app.use(express.static("public"));

// Basic route for users
// =====================
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.json(db);
});

//  Catch-All
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// POST db.json
app.post("/api/notes", function (req, res) {
    // Selects the body of text
        let notes = req.body;
    // Adds an id key to the object notes 
        notes.id = notes.title
    // pushes the note to the db array
        db.push(notes);

  // Writes the new array (after stringifiy'ing it) to the api/notes json page
  fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
    if (err) {
      console.log("err"), res.sendStatus(404);
    } else console.log(200), res.sendStatus(200);
  });
});

// DELETE specific JSON date using an id
app.delete("/api/notes/:id", function (req, res) {
    let deleteThis = req.params.id;
    
    for (var i = 0; i < db.length; i++) {
  
      if (deleteThis === db[i].id) {
        db.splice([i], 1);
        res.json(db)
      } 
  }
  });
  

// App listener
app.listen(PORT, function () {
  console.log("App is listening on http://localhost:" + PORT);
});
